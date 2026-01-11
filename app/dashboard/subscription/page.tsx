"use client"

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
    return (
        <div>
            <h1>Subscription</h1>
        </div>
    )
}

