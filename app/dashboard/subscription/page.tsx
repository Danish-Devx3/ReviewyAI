"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { subscriptionData } from "@/module/payments/action"
import { useQuery } from "@tanstack/react-query"
import { Check, RefreshCw, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

const PLAN_TYPES = {
    free: [
        { name: "Up to 5 repositories", included: true },
        { name: "Up to 5 reviews per repository", included: true },
        { name: "Basic code review", included: true },
        { name: "Community support", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
    ],

    pro: [
        { name: "Up to 5 repositories", included: true },
        { name: "Up to 5 reviews per repository", included: true },
        { name: "Basic code review", included: true },
        { name: "Community support", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Priority support", included: true },
    ],
}

export default function Subscription() {
    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [portalLoading, setPortalLoading] = useState(false)
    const [syncLoading, setSyncLoading] = useState(false)
    const searchParams = useSearchParams()
    const success = searchParams.get("success")

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["subscription-data"],
        queryFn: async () => await subscriptionData(),
        refetchOnWindowFocus: true,
    })

    const currentTier = data?.user?.subscriptionTier
    const isPro = currentTier === "PRO"
    const isActive = data?.user?.subscriptionStatus === "ACTIVE"

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <Spinner />
        </div>
    }

    if (error) {
        return <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
                <p className="text-muted-foreground">Failed to load subscription data</p>
            </div>
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load subscription data
                    <Button onClick={() => refetch()}>Retry</Button>
                </AlertDescription>
            </Alert>
        </div>
    }

    if (!data?.user) {
        return <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
                <p className="text-muted-foreground">Please login to view subscription plans</p>
            </div>
        </div>
    }

    async function handleSync() {
        setSyncLoading(true)
        await refetch()
        setSyncLoading(false)
    }

    return (
        <div className="space-y-6" >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
                    <p className="text-muted-foreground">Choose a plan to upgrade your account</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => handleSync()}
                    disabled={syncLoading}
                >
                    {syncLoading ? <Spinner className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Sync Status
                </Button>
            </div>

            {success === "true" && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-900">
                    <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                        Subscription status synced successfully. Changes may take a few moments to reflect.
                    </AlertDescription>
                </Alert>
            )}

            {data.limits && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Current Usage
                        </CardTitle>
                        <CardDescription>
                            Your current usage is based on the plan you have subscribed to.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Repositories</span>
                                    <Badge variant={data.limits.repositories.isExceeded ? "destructive" : "default"}>{data.limits.repositories.current} / {data.limits.repositories.limit ?? "Unlimited"}</Badge>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        style={{
                                            width: data.limits.repositories.limit ? `${(data.limits.repositories.current / data.limits.repositories.limit) * 100}%` : "100%"
                                        }}
                                        className={cn("h-full", data.limits.repositories.isExceeded ? "bg-destructive" : "bg-primary")}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Reviews per repository</span>
                                    <Badge variant="outline" >{isPro ? "Unlimited" : "3"}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{isPro ? "No limit" : "3 reviews per repository"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <Card className={!isPro ? "ring-2 ring-primary" : ""}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Free</CardTitle>
                                <CardDescription>Perfect for getting started</CardDescription>
                            </div>
                            {!isPro && <Badge className="ml-2">Current Plan</Badge>}
                        </div>
                        <div className="mt-2">
                            <span className="text-3xl font-bold">
                                $0
                            </span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {PLAN_TYPES.free.map((type) => (
                                <div key={type.name} className="flex items-center gap-2">
                                    {type.included ? (
                                        <Check className="h-4 w-4 text-primary shrink-0" />
                                    ) : (
                                        <X className="h-4 w-4 text-muted-foreground shrink-0" />
                                    )}
                                    <span className="text-sm font-medium">{type.name}</span>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full" variant={"outline"} disabled>
                            {!isPro ? "Current Plan" : "Upgrade"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Pro</CardTitle>
                                <CardDescription>Perfect for teams</CardDescription>
                            </div>
                            {isPro && <Badge className="ml-2">Current Plan</Badge>}
                        </div>
                        <div className="mt-2">
                            <span className="text-3xl font-bold">
                                $9.99
                            </span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {PLAN_TYPES.pro.map((type) => (
                                <div key={type.name} className="flex items-center gap-2">
                                    {type.included ? (
                                        <Check className="h-4 w-4 text-primary shrink-0" />
                                    ) : (
                                        <X className="h-4 w-4 text-muted-foreground shrink-0" />
                                    )}
                                    <span className="text-sm font-medium">{type.name}</span>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full" variant={"outline"}>
                            {isPro ? "Current Plan" : "Upgrade"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}

