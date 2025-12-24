"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserProfile, updateUserProfile } from "../actions"
import { toast } from "sonner"

export const useUserProfile = () => useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => await getUserProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
})

export const useUpdateUserProfile = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-user-profile"],
        mutationFn: async (data: {name: string; email: string;})=>{
            return await updateUserProfile(data);
        },

        onSuccess: (result)=>{
            if(result.success){
                queryClient.invalidateQueries({
                    queryKey: ["user-profile"]
                })

                toast.success("Profile updated successfully")
            }

        },
        onError: (error)=>{
            toast.error("Failed to update profile")
            console.log(error)
        }

    })
} 