"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectRepo } from "../actions";
import { toast } from "sonner";

export const useConnectRepo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ owner, repo, githubId }: { owner: string, repo: string, githubId: string }) => {
            return await connectRepo(owner, repo, githubId);
        },
        onSuccess: () => {
            toast.success("Repository connected successfully");
            queryClient.invalidateQueries({ queryKey: ["repositories"] });
        },
        
        onError: (error)=>{
            toast.error("Failed to connect repository")
            console.log(error)
        }
    })
}