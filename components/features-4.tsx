import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap } from 'lucide-react'

export default function Features() {
    return (
        <section id="features" className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">Everything you need for better code reviews</h2>
                    <p>ReviewyAI brings AI-powered insights to your workflow, helping teams write cleaner code and ship with confidence.</p>
                </div>

                <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Instant Reviews</h3>
                        </div>
                        <p className="text-sm">Get feedback in seconds, not hours. AI reviews your PRs the moment you push.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Smart Analysis</h3>
                        </div>
                        <p className="text-sm">Deep code understanding catches bugs and suggests improvements automatically.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="size-4" />

                            <h3 className="text-sm font-medium">Secure by Design</h3>
                        </div>
                        <p className="text-sm">Your code never leaves your infrastructure. SOC 2 compliant.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Pencil className="size-4" />

                            <h3 className="text-sm font-medium">Custom Rules</h3>
                        </div>
                        <p className="text-sm">Define your own coding standards. ReviewyAI enforces them consistently.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Settings2 className="size-4" />

                            <h3 className="text-sm font-medium">GitHub Native</h3>
                        </div>
                        <p className="text-sm">Seamless integration with GitHub. Reviews appear right in your PRs.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">AI Suggestions</h3>
                        </div>
                        <p className="text-sm">One-click fixes and refactoring suggestions powered by advanced AI.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
