"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetReviews } from "@/module/review/hooks/useGetReviews";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import React from "react";

function Page() {
  const { data: reviews, error, isLoading } = useGetReviews();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews History</h1>
        <p>Views all AI reviews </p>
      </div>
      {reviews?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No reviews yet. Connect a repository and open a PR to get
                reviews
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews?.map((review, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {review.prTitle}
                      </CardTitle>
                      {review.status === "completed" && (
                        <Badge variant={"default"} className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                      {review.status === "failed" && (
                        <Badge variant={"destructive"} className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Failed
                        </Badge>
                      )}
                    </div>

                    <CardDescription>
                      {review.repository.fullName} . PR #{review.prNumber}
                    </CardDescription>
                  </div>
                  <Button variant={"ghost"} size={"icon"} asChild>
                    <a
                      href={review.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-xs">
                        {review.review.substring(0, 300)}
                      </pre>
                    </div>
                  </div>
                  <Button>
                    <a
                      href={review.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Review
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;
