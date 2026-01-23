
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer";
import { TextEffect } from "@/components/ui/text-effect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code2, Rocket, Users } from "lucide-react";

export const metadata = {
    title: "About - ReviewyAI",
    description: "Learn more about ReviewyAI, our mission, and the team behind the AI-powered code review assistant.",
};

export default function AboutPage() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                {/* Hero Section */}
                <section className="relative pt-24 md:pt-36 pb-20">
                    <div
                        aria-hidden
                        className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 isolate opacity-65 contain-strict pointer-events-none -z-20">
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] opacity-20 bg-[radial-gradient(closest-side,var(--color-primary)_0%,transparent_100%)] blur-[100px]" />
                    </div>


                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="text-4xl font-semibold tracking-tight sm:text-6xl text-balance"
                            >
                                Revolutionizing Code Reviews
                            </TextEffect>
                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={0.5}
                                as="p"
                                className="mt-6 text-lg leading-8 text-muted-foreground text-balance"
                            >
                                We are on a mission to help developers ship better code faster, with the power of autonomous AI.
                            </TextEffect>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-24 sm:py-32 relative">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:max-w-none">
                            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 lg:items-center">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Mission</h2>
                                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                        Software development is moving faster than ever, but code reviews are still a bottleneck.
                                        Engineers spend hours reviewing PRs, catching trivial bugs, and debating style, instead of focusing on architecture and logic.
                                    </p>
                                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                        ReviewyAI was born to solve this. We believe that AI can be the perfect pair programmer—handling the tedious parts of code review, detecting bugs instantly, and enforcing best practices, so you can merge with confidence.
                                    </p>
                                    <div className="mt-10 flex items-center gap-x-6">
                                        <Button asChild>
                                            <Link href="/login">
                                                Get Started <ArrowRight className="ml-2 size-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                                <div className="relative isolate overflow-hidden bg-muted/50 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pb-14 lg:mx-0 lg:max-w-none">
                                    <div className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white dark:bg-indigo-950/20" aria-hidden="true" />
                                    <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="p-6 bg-background rounded-2xl shadow-sm border">
                                                <Rocket className="size-8 mb-4 text-primary" />
                                                <h3 className="font-semibold">Ship Faster</h3>
                                                <p className="text-sm text-muted-foreground mt-2">Reduce PR turnaround time from days to minutes.</p>
                                            </div>
                                            <div className="p-6 bg-background rounded-2xl shadow-sm border text-primary-foreground sm:translate-y-12">
                                                <Code2 className="size-8 mb-4 text-primary" />
                                                <h3 className="font-semibold text-foreground">Clean Code</h3>
                                                <p className="text-sm text-muted-foreground mt-2">Enforce consistent standards automatically.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet the Creator</h2>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                Built with passion by a developer, for developers.
                            </p>
                        </div>
                        <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            <li>
                                <div className="flex items-center gap-x-6">
                                    {/* Placeholder for avatar if none exists, using initials */}
                                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                        DA
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold leading-7 tracking-tight">Danish Ansari</h3>
                                        <p className="text-sm font-semibold leading-6 text-primary">Founder & Lead Engineer</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

            </main>
            <FooterSection />
        </>
    );
}