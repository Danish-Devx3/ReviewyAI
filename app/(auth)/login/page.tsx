import LoginCard from '@/module/auth/components/loginCard'
import { requireNoAuth } from '@/module/auth/utils/authUtills'
import React from 'react'

const Login = async () => {
    await requireNoAuth();
  return (
    <div>
      <LoginCard/>
    </div>
  )
}

export default Login
