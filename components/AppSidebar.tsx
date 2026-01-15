"use client";

import { useSession } from "@/lib/authClient";
import {
  BookCopy,
  BookOpen,
  Github,
  LayoutDashboard,
  LogOut,
  MessageCircleCode,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Logout from "@/module/auth/components/logout";

export const AppSidebar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Standard pattern to prevent hydration mismatch with client-side theme
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) return null;

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Repository",
      href: "/dashboard/repository",
      icon: <BookCopy />,
    },
    {
      title: "Reviews",
      href: "/dashboard/reviews",
      icon: <MessageCircleCode />,
    },
    {
      title: "Subscription",
      href: "/dashboard/subscription",
      icon: <User />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings />,
    },
  ];

  const IsActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/dashboard");
  };

  const user = session?.user;
  const username = user?.name || "Guest";
  const userEmail = user?.email || "";
  const userInitials = username
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-center gap-2 py-2 px-2">
          <svg
            width="30"
            height="30"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30 28V12C30 10.8954 29.1046 10 28 10H27.8994C27.369 10 26.8604 10.2109 26.4854 10.5859L10.5859 26.4854C10.2109 26.8604 10 27.369 10 27.8994V40H0V27.8994C2.15312e-05 24.7168 1.26423 21.6645 3.51465 19.4141L19.4141 3.51465C21.6645 1.26423 24.7168 2.1373e-05 27.8994 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H14V30H28C29.1046 30 30 29.1046 30 28Z M0 0H17L7 10H0V0Z"
              fill="#FF4D00"
            ></path>
          </svg>
          <h1 className="text-2xl font-bold">ReviewyAI</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-6 flex-col gap-1">
        <div className="mb-2">
          <p className="text-xs font-semibold text-sidebar-foreground/60 tracking-wide">
            Menu
          </p>
        </div>

        <SidebarMenu className="gap-2">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`h-11 px-4 rounded-lg transition-all duration-200 ${
                  IsActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "hover:bg-sidebar-accent/60 text-sidebar-foreground"
                }`}
              >
                <Link className="flex items-center gap-3" href={item.href}>
                  <span className="w-5 h-5 shrink-0">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size={"lg"}
                  className="h-12 px-4 rounded-lg data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
                >
                  <Avatar className="h-10 w-10 rounded-lg shrink-0">
                    <AvatarImage
                      src={user?.image || undefined}
                      alt={username}
                    />
                    <AvatarFallback className="rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-relaxed min-w-0">
                    <span className="truncate font-semibold text-base ">
                      {username}
                    </span>
                    <span className="truncate text-sm text-sidebar-accent-foreground/70">
                      {userEmail}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-80 rounded-lg"
                align="end"
                side="left"
                sideOffset={8}
              >
                <div className="px-2 py-3">
                  <DropdownMenuItem asChild>
                    <button
                      className="w-full px-3 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-sidebar-accent/50 transition-colors text-sm font-medium"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="w-5 h-5" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-5 h-5" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer px-3 py-3 my-1 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors font-medium">
                    <LogOut className="w-5 h-5 mr-3 shrink-0" />
                    <Logout>
                      <button>Logout</button>
                    </Logout>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
