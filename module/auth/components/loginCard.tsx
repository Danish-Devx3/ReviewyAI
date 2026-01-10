"use client"

import React, { useState } from 'react'
import { signIn } from '@/lib/authClient'
import { GithubIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const LoginCard = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGithubSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn.social({ provider: "github" })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("Login error:", error)
    }
  }

  const authProviders = [
    {
      name: 'GitHub',
      icon: <GithubIcon />,
      action: handleGithubSignIn,
      available: true
    },
  ]

  return (
    <Card className="w-full max-w-md border-border">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-destructive via-chart-1 to-destructive bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-sm">
          Login using one of the following providers:
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {authProviders.map((provider) => (
          <Button
            key={provider.name}
            onClick={provider.action}
            disabled={isLoading || !provider.available}
            variant="outline"
            className="w-full h-14 text-base font-medium relative group hover:border-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{provider.icon}</span>
                <span>{provider.name}</span>
              </div>
              {provider.available ? (
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {isLoading ? '...' : 'Sign In'}
                </span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  Soon
                </span>
              )}
            </div>
          </Button>
        ))}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          New to ReviewyAI?{' '}
          <Link
            href="/signup"
            className="text-destructive hover:underline font-semibold transition-colors"
          >
            Sign Up
          </Link>
        </p>

        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to the{' '}
          <Link href="/terms" className="hover:text-foreground transition-colors underline">
            Terms of Use
          </Link>
          {' '}and{' '}
          <Link href="/privacy" className="hover:text-foreground transition-colors underline">
            Privacy Policy
          </Link>
          {' '}applicable to ReviewyAI
        </p>
      </CardFooter>
    </Card>
  )
}

export default LoginCard
