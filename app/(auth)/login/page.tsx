import LoginCard from '@/module/auth/components/loginCard'
import { requireNoAuth } from '@/module/auth/utils/authUtills'
import React from 'react'
import { Card } from '@/components/ui/card'

const Login = async () => {
  await requireNoAuth();
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Hero Section */}
      <Card className="hidden lg:flex flex-col justify-center px-12 xl:px-20 rounded-none border-0 bg-gradient-to-br from-background via-background to-muted">
        <div className="max-w-2xl">
          <h1 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
            Cut Code Review<br />
            Time & Bugs in <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">Half</span>.<br />
            Instantly.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl font-mono">
            Supercharge your team to ship faster with the most advanced AI code reviews.
          </p>
        </div>
      </Card>

      {/* Right Login Section */}
      <div className="flex items-center justify-center p-8 bg-background">
        <LoginCard />
      </div>
    </div>
  )
}

export default Login
