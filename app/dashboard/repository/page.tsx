"use client"

import { UseRepositories } from "@/module/repository/actions/hooks/useRepositories"

interface Repository {
    id: string
    name: string
    full_name: string
    description: string | null
    html_url: string
    language: string | null
    stargazers_count: number
    topics: string[]
    isConnected: boolean
}


const page = () => {
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = UseRepositories();
  return (
    <div>page</div>
  )
}

export default page