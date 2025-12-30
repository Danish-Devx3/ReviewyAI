"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {  disconnectAllRepos, disconnectRepository, getConnectedRepos } from "../actions"
import { toast } from "sonner"

export const useConnectedRepos = () => {
    return useQuery({
        queryKey: ["connected-repos"],
        queryFn: async () => await getConnectedRepos(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    })
}

export const useDisconnectRepo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (repoId: string) => await disconnectRepository(repoId),
        onSuccess: (result)=>{
            if (result.success) {
                queryClient.invalidateQueries({
                    queryKey: ["connected-repos"]
                })
                queryClient.invalidateQueries({
                    queryKey: ["dashboard-data"]
                })

                toast.success("Repository disconnected successfully")
            } else {
                toast.error("Failed to disconnect repository")
            }
        }
    })
}

export const useDisconnectAllRepos = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => await disconnectAllRepos(),
        onSuccess: (result)=>{
            if (result.success) {
                queryClient.invalidateQueries({
                    queryKey: ["connected-repos"]
                })
                queryClient.invalidateQueries({
                    queryKey: ["dashboard-data"]
                })

                toast.success("All repositories disconnected successfully")
            } else {
                toast.error("Failed to disconnect all repositories")
            }
        }
    })
}