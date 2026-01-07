"use client"

import { useEffect, useState } from "react";
import { useUpdateUserProfile, useUserProfile } from "../hooks/useUserProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ProfileForm = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const { data: userProfile, isLoading } = useUserProfile();
    const { mutate: updateUserProfile, isPending: isUpdating } = useUpdateUserProfile();

    // Initialize form values when userProfile is loaded
    const initialName = userProfile?.name || "";
    const initialEmail = userProfile?.email || "";

    // Only set initial values once when userProfile becomes available
    useEffect(() => {
        if (userProfile && !name && !email) {
            setName(initialName);
            setEmail(initialEmail);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProfile]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await updateUserProfile({ name, email });
    }

    if (isLoading) {
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
                            <Input
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
                            <Input
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
                    <div className="mt-6">
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? "Updating..." : "Update Profile"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}