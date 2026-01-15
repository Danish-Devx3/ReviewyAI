import { AppSidebar } from "@/components/AppSidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { requireAuth } from "@/module/auth/utils/authUtills"

import React from "react"

const DashboardLayout = async ({
    children
}: { children: React.ReactNode }) => {
    await requireAuth();
    return (

        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>

                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 fixed w-full bg-sidebar z-30">

                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </header>
                <main className="flex-1 overflow-auto p-4 md:p-6 mt-14">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>


    )
}

export default DashboardLayout
