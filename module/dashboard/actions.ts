"use server";

import { fetchUserContributions, getGithubToken } from "../github/lib/github";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Octokit } from "octokit";

export const getDashboardStats = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken();

    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    const totalRepos = 30;

    const calendar = await fetchUserContributions(token, user.login);
    const totalCommits = calendar.totalContributions || 0;

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr`,
      per_page: 1,
    });

    const totalPrs = prs.total_count || 0;

    // ai review count
    const totalReviews = 33;

    return {
      totalRepos,
      totalCommits,
      totalPrs,
      totalReviews,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    return {
      totalRepos: 0,
      totalCommits: 0,
      totalPrs: 0,
      totalReviews: 0,
    };
  }
};

export const getMonthlyActivity = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken();

    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    const calendar = await fetchUserContributions(token, user.login);

    if (!calendar) {
      return [];
    }

    const monthlyData: { [key: string]: { commits: number; prs: number; reviews: number } } = {};

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const data = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKeys = monthNames[data.getMonth()];
      monthlyData[monthKeys] = { commits: 0, prs: 0, reviews: 0 };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calendar.weeks.forEach((week: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      week.contributionDays.forEach((day: any) => {
        const date = new Date(day.date);
        const monthKey = monthNames[date.getMonth()];
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].commits += day.contributionCount;
        }
      });
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // todo: reviews real data

    const generateSampleReviews = () => {
      const reviews = [];
      const now = new Date();
      // Generate random review dates within the last 6 months
      for (let i = 0; i < 45; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 180); // 0 to 179 days ago
        const reviewDate = new Date(now);
        reviewDate.setDate(now.getDate() - randomDaysAgo);
        reviews.push({
          createdAt: reviewDate
        });
      }

      return reviews;
    }

    const reviews = generateSampleReviews();

    reviews.forEach((review) => {
      const monthKey = monthNames[review.createdAt.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].reviews += 1;
      }
    });

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>=${sixMonthsAgo.toISOString().split('T')[0]}`,
      per_page: 100,
    });

    prs.items.forEach((pr) => {
      const prDate = new Date(pr.created_at);
      const monthKey = monthNames[prDate.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].prs += 1;
      }
    });

    return Object.keys(monthlyData).map((month) => ({
      month,
      ...monthlyData[month],
    }));

  } catch (error) {
    console.error("Error fetching monthly activity:", error);
    return [];
  }
};

export async function getContributionActivity() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken();

    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();
    const calendar = await fetchUserContributions(token, user.login);

    if (!calendar) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contributions = calendar.weeks.flatMap((week: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: Math.min(4, Math.floor(day.contributionCount / 3)), // Convert to 0-4 scale
      }))
    );

    return {
      contributions,
      totalContributions: calendar.totalContributions
    };
  }
  catch (error) {
    console.error("Error fetching contribution activity:", error);
    return null;
  }
}

