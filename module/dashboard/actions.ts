"use server";

import { fetchUserContributions, getGithubToken } from "../github/lib/github";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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

    if(!calendar){
        return [];
    }

    const monthlyData: { [key: string]: {commits:number; prs:number; reviews:number} } = {};

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
    for(let i=5; i>=0; i--){
        const data = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKeys = monthNames[data.getMonth()];
        monthlyData[monthKeys] = {commits:0, prs:0, reviews:0};
    }

    calendar.weeks.forEach((week) => {
        week.contributionDays.forEach((day) => {
            const date = new Date(day.date);
            const monthKey = monthNames[date.getMonth()];
            monthlyData[monthKey].commits += day.contributionCount;
            
  } catch (error) {}
};
