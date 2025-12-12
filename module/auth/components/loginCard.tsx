"use client"

import React, { useState } from 'react'
import { signIn } from '@/lib/authClient'

import { GithubIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'


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

  return (
    <div className='min-h-screen bg-linear-to-br from-black via-black to-zinc-900 text-white flex items-center h-screen'>
      <div>
        <h1></h1>
      </div>
      <div className='flex items-center justify-center h-screen'>
        <Button onClick={handleGithubSignIn} disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign In with GitHub"}
        </Button>
      </div>
    </div>
  )
}

export default LoginCard
