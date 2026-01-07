"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UseRepositories } from "@/module/repository/hooks/useRepositories";
import { RepositoryListSkeleton } from "@/module/repository/components/repositorySkeleton";
import { ExternalLink, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useConnectRepo } from "@/module/repository/hooks/useConnectRepo";

interface Repository {
  id: string;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  isConnected: boolean;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localConnectingId, setLocalConnectingId] = useState<string | null>(null)
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = UseRepositories();

  const { mutate: connectRepo } = useConnectRepo()

  const allRepo = data?.pages.flatMap((page) => page) || [];

  const filteredRepositories = allRepo.filter(
    (repo: Repository) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleConnect(repo: Repository) {
    setLocalConnectingId(repo.id)
    connectRepo({
      owner: repo.full_name.split("/")[0],
      repo: repo.name,
      githubId: repo.id
    },
      {
        onSettled: () => setLocalConnectingId(null)
      }
    )

  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }, { threshold: 1.0 })

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            Manage and view all Github repositories
          </p>
        </div>
        <RepositoryListSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            Manage and view all Github repositories
          </p>
        </div>
        <p className="text-red-500">Error loading repositories. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Repositories</h1>
        <p className="text-muted-foreground">
          Manage and view all Github repositories
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          className="pl-8"
          placeholder="Search Repos"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredRepositories.map((repo: Repository) => (
          <Card key={repo.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{repo.name}</CardTitle>
                    <Badge variant={"outline"}>{repo.language}</Badge>
                    {repo.isConnected && (
                      <Badge variant={"secondary"}>Connected</Badge>
                    )}
                  </div>
                  <CardDescription>{repo.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    onClick={() => handleConnect(repo)}
                    disabled={localConnectingId === repo.id}
                  >
                    {localConnectingId === repo.id ? "Connecting..." : repo.isConnected ? "Connected" : "Connect"}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && <RepositoryListSkeleton />}
        {
          !hasNextPage && allRepo.length < 0 && (
            <p className="text-center text-muted-foreground">No More Repositories</p>
          )
        }
      </div>
    </div>
  );
};

export default Page;
