"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchRepositories } from ".."

export const UseRepositories = ()=>{
    return useInfiniteQuery({
        queryKey: ["repositories"],
        queryFn: async ({pageParam=1})=>{
            const data = await fetchRepositories(pageParam, 10)
            return data;
        },

        getNextPageParam: (lastPage, allPage)=>{
            if(lastPage.length < 10) return undefined;
            return allPage.length + 1;
        },
        initialPageParam: 1
    })
}