import { reviewPR } from "@/module/ai/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = req.headers.get("x-github-event");

    if (event === "ping") {
      return NextResponse.json({ message: "pong" }, { status: 200 });
    }

    if (event === "pull_request") {
      const { action, number } = body;
      const repo = body.repository.full_name;
      console.log("[GitHub Webhook]", { event, repo, action, number });

      const [owner, repoName] = repo.split("/");

      if (action === "opened" || action === "synchronize") {
        reviewPR(owner, repoName, number)
          .then(() =>
            console.log(`Review completed for ${repoName}, #${number}`)
          )
          .catch(() => console.log(`Review faled for ${repoName}, #${number}`));
      }
    }

    return NextResponse.json({ message: "Event Processes" }, { status: 200 });
  } catch (error) {
    console.error("Error in processing webhook");
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
