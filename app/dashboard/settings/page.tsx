"use client"

import { ProfileForm } from "@/module/settings/components/profileForm";
import RepoList from "@/module/settings/components/repoList";

const SettingPage = () => {
    return <div className="space-y-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
                Setting
            </h1>
            <p className="text-muted-foreground">Manage your account settings and connected repository</p>
        </div>
        <ProfileForm/>
        <RepoList/>
    </div>
}

export default SettingPage;