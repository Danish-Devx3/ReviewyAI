import React, { useState } from "react";
import {
  useConnectedRepos,
  useDisconnectAllRepos,
  useDisconnectRepo,
} from "../hooks/useRepo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink, Trash2 } from "lucide-react";

function RepoList() {
  const [disconnectAllDialogOpen, setDisconnectAllDialogOpen] = useState(false);
  const { data: repos, isLoading } = useConnectedRepos();
  const disconnectRepo = useDisconnectRepo();
  const disconnectAllRepos = useDisconnectAllRepos();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Repositories</CardTitle>
          <CardDescription>Manage your connected repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="space-y-2">
          <CardTitle>Connected Repositories</CardTitle>
          <CardDescription>Manage your connected repositories</CardDescription>
        </div>
        {repos && repos.length === 0 && (
          <CardContent>
            <p>No connected repositories found.</p>
          </CardContent>
        )}
        {repos && repos.length > 0 && (
          <AlertDialog
            open={disconnectAllDialogOpen}
            onOpenChange={setDisconnectAllDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-4">
                <Trash2 className="mr-1" size={16} /> Disconnect All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Disconnect All Repositories?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will disconnect all your connected {repos.length}{" "}
                  repositories & AI reviews. Are you sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={disconnectAllRepos.isPending}
                  onClick={() => disconnectAllRepos.mutate()}
                >
                  {disconnectAllRepos.isPending
                    ? "Disconnecting..."
                    : "Disconnect All"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        {!repos || repos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No repository connected yet.</p>
            <p className="text-sm mt-2">
              Connect repositories from Repository page
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{repo.fullName}</h3>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="ml-4 text-destructive hover:bg-destructive/10 transition-colors"
                      size={"sm"}
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Disconnect Repository?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will disconnect this{" "}
                        <strong>{repo.fullName}</strong> repository & AI
                        reviews. Are you sure you want to proceed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => disconnectRepo.mutate(repo.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={disconnectRepo.isPending}
                      >
                        {disconnectRepo.isPending
                          ? "Disconnecting..."
                          : "Disconnect"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RepoList;
