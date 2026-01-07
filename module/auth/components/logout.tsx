"use client"
import { signOut } from '@/lib/authClient'
import { useRouter } from 'next/navigation';
import React from 'react'

function Logout({ children, className }: { children: React.ReactNode, className?: string }) {
  const router = useRouter();
  return (
    <span className={className} onClick={() => signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login')
        }
      }
    })}>{children}</span>
  )
}

export default Logout