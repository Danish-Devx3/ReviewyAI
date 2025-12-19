"use client";

import { getContributionActivity } from "@/module/dashboard/actions";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { ActivityCalendar } from "react-activity-calendar";
import React from "react";

function ContributionActivityChart() {
  const { theme } = useTheme();

  const { data: contributionData, isLoading } = useQuery({
    queryKey: ["contribution-data"],
    queryFn: async () => getContributionActivity(),
    staleTime: 1000 * 60 * 5,
  });
  console.log(contributionData);
  if (!contributionData || !contributionData.contributions)
    return (
      <div className="w-full flex flex-col items-center justify-center p-8">
        <h1 className="text-muted-foreground">
          No contribution data available
        </h1>
      </div>
    );
  return (
    <div className="w-full flex flex-col items-center gap-4 p-4">
      <div className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {contributionData.totalContributions + " "}
        </span>
        contributions in the last year
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex justify-center min-w-max">
          <ActivityCalendar
            loading={isLoading}
            data={contributionData.contributions}
            blockSize={12}
            blockMargin={4}
            fontSize={14}
            blockRadius={4}
            colorScheme={theme === "dark" ? "dark" : "light"}
            showWeekdayLabels
            showMonthLabels
            theme={{
              light: ["hsl(0, 0%, 92%)", "hsl(142, 71%, 45%)"],
              dark: ["#353535", "hsl(142, 71%, 45%)"],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ContributionActivityChart;
