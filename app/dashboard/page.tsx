"use client"

import ContributionActivityChart from "@/components/contributionChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats, getMonthlyActivity } from "@/module/dashboard/actions"
import { useQuery } from "@tanstack/react-query"
import { GitBranch, GitCommit } from "lucide-react"

const DashboardPage = () => {
    const {data: stats, isLoading} = useQuery({
        queryKey: ["dashboard-data"],
        queryFn: async ()=> await getDashboardStats(),
        refetchOnWindowFocus: false
    })

    const {data: monthlyActivity, isLoading: isLoadingActivity} = useQuery({
        queryKey: ["monthly-act"],
        queryFn: async ()=> await getMonthlyActivity(),
        refetchOnWindowFocus: false
    })
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your coading activity and AI reviews</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
                        <GitBranch className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : stats?.totalRepos || 0}</div>
                        <p className="text-xs text-muted-foreground">Connected Repositories</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                        <GitCommit className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : stats?.totalCommits || 0}</div>
                        <p className="text-xs text-muted-foreground">In the last year</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
                        <GitBranch className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : stats?.totalPrs || 0}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Reviews</CardTitle>
                        <GitCommit className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : stats?.totalReviews || 0}</div>
                        <p className="text-xs text-muted-foreground">Reviewed in the last year</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Contribution Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <ContributionActivityChart />
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardPage
