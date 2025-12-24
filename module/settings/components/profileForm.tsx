"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { useUpdateUserProfile, useUserProfile } from "../hooks/useUserProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ProfileForm = () => {
    const queryClient = useQueryClient();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const { data: userProfile, isLoading } = useUserProfile();
    const {mutate: updateUserProfile, isLoading: isUpdating} = useUpdateUserProfile();

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name || "")
            setEmail(userProfile.email || "")
        }
    }, [userProfile]);

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUserProfile({ name, email });
    }

    if(isLoading){
        return <Card>
        <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="animate-pulse space-y-4">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
            </div>
        </CardContent>
    </Card>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}