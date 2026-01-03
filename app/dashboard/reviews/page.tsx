"use client"

import { useGetReviews } from '@/module/review/hooks/useGetReviews'
import React from 'react'

function Page() {
    const {data: reviews, error, isLoading} = useGetReviews();

    if(isLoading){
        return <div>Loading...</div>
    }
    if(error){
        return <div>Error: {error.message}</div>
    }
  return (
    <div>
        
    </div>
  )
}

export default Page