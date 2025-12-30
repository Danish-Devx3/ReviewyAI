"use client"

import { getConnectedRepos } from "@/module/github/lib/github"
import { useQuery } from "@tanstack/react-query"

export const useConnectedRepos = () => {
    return useQuery({
        queryKey: ["connected-repos"],
        queryFn: async () => await getConnectedRepos(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    })
}

export const 