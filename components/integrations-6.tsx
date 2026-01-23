import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Github } from 'lucide-react'

// Simple GitLab icon component
const GitLabIcon = () => (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
        <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
    </svg>
)

// Simple Bitbucket icon component  
const BitbucketIcon = () => (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
        <path d="M.778 1.213a.768.768 0 0 0-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 0 0 .77-.646l3.27-20.03a.768.768 0 0 0-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z" />
    </svg>
)

export default function IntegrationsSection() {
    return (
        <section id="integrations">
            <div className="bg-muted dark:bg-background py-24 md:py-32">
                <div className="mx-auto flex flex-wrap-reverse justify-between items-center max-w-5xl px-6">
                    <div className="mx-auto mb-6 max-w-lg space-y-6 text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">Works with your repos</h2>
                        <p className="text-muted-foreground">Connect your repositories in seconds. ReviewyAI integrates with all major git platforms.</p>

                        <Button
                            variant="outline"
                            size="sm"
                            asChild>
                            <Link href="/login">Get Started</Link>
                        </Button>
                    </div>
                    <div className="mx-auto max-w-md px-6">
                        <div className="bg-background dark:bg-muted/50 rounded-xl border px-6 pb-12 pt-3 shadow-xl">
                            <Integration
                                icon={<Github className="size-6" />}
                                name="GitHub"
                                description="Review PRs directly in your GitHub workflow."
                            />
                            <Integration
                                icon={<GitLabIcon />}
                                name="GitLab"
                                description="Full support for GitLab merge requests."
                            />
                            <Integration
                                icon={<BitbucketIcon />}
                                name="Bitbucket"
                                description="Seamless Bitbucket pull request integration."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Integration = ({ icon, name, description }: { icon: React.ReactNode; name: string; description: string }) => {
    return (
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-dashed py-3 last:border-b-0">
            <div className="bg-muted border-foreground/5 flex size-12 items-center justify-center rounded-lg border">{icon}</div>
            <div className="space-y-0.5">
                <h3 className="text-sm font-medium">{name}</h3>
                <p className="text-muted-foreground line-clamp-1 text-sm">{description}</p>
            </div>
            <Button
                variant="outline"
                size="icon"
                aria-label="Add integration">
                <Plus className="size-4" />
            </Button>
        </div>
    )
}
