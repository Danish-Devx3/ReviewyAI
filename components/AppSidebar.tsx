"use client"

import { useSession } from "@/lib/authClient";
import { BookOpen, Github, Settings, User } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "./ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";



export const AppSidebar = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    useEffect(() => {
        setMounted(true);
    }, []);

    const navigationItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: <BookOpen />
        },
        {
            title: "Repository",
            href: "/dashboard/repository",
            icon: <Github />
        },
        {
            title: "Reviews",
            href: "/dashboard/reviews",
            icon: <BookOpen />
        },
        {
            title: "Subscription",
            href: "/dashboard/subscription",
            icon: <User />
        },
        {
            title: "Settings",
            href: "/dashboard/settings",
            icon: <Settings />
        }
    ]

    const IsActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + "/dashboard");
    }

    const user = session?.user;
    const username = user?.name || "Guest";
    const userEmail = user?.email || "";
    const userInitials = username.split(" ").map(name => name[0]).join("").toUpperCase();


    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="flex flex-col items-center gap-4 py-6 px-2">
                    <div className="flex items-center gap-4 px-3 py-4 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent/70 transition-colors duration-200">

                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                            <Github className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-sidebar-foreground tracking-wide">Connected Account</p>
                            <p className="text-sm text-muted-foreground">@{username}</p>
                        </div>

                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-3 py-6 flex-col gap-1">

                <div className="mb-2">
                    <p className="text-xs font-semibold text-sidebar-foreground/60 tracking-wide">Menu</p>
                </div>

            </SidebarContent>
        </Sidebar>
    )
}