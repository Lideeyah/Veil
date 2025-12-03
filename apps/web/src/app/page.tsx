import { Button, Card, CardHeader, CardTitle, CardContent } from '@veil/ui';
import Link from 'next/link';
import { Shield, Lock, Zap, ArrowRight, EyeOff, UserX, Globe, CheckCircle } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col items-center overflow-hidden">
            {/* Hero Section */}
            <section className="relative w-full py-24 md:py-32 lg:py-48 flex flex-col items-center justify-center min-h-screen">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-0" />

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center space-y-8 text-center">
                        <div className="space-y-4 max-w-4xl">
                            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none text-gradient-primary drop-shadow-sm">
                                Support Creators Who Matter. <br /> Your Identity Stays Hidden.
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                                Traditional platforms expose who you support. Veil uses Zcash to keep your support completely private.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/discover">
                                <Button size="lg" variant="glow" className="w-full sm:w-auto text-lg px-8 h-12">
                                    Browse Creators <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/how-it-works">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-12">
                                    How It Works
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground pt-4">
                            Trusted by activists, journalists, and privacy advocates worldwide.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Privacy Matters Section */}
            <section className="w-full py-24 bg-zinc-900/50 backdrop-blur-sm border-y border-white/5">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <div className="space-y-6">
                            <h2 className="font-heading text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Your Financial Choices Shouldn't Be Public
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                When you support someone on traditional platforms, your name is on a list. Veil changes that.
                            </p>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary mt-1">
                                        <EyeOff className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Your Identity Protected</h3>
                                        <p className="text-muted-foreground">No one knows who you support. Not the creator, not us, not anyone.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary mt-1">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Uncensorable Support</h3>
                                        <p className="text-muted-foreground">Payment processors can't block you. Banks can't freeze you.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary mt-1">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Support Across Borders</h3>
                                        <p className="text-muted-foreground">Send money anywhere. No restrictions. No surveillance.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/50 shadow-2xl flex flex-col p-6 space-y-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent" />

                            {/* Testimonial Cards */}
                            <Card className="glass-card border-white/5 relative z-10 transform translate-x-4">
                                <CardContent className="p-6">
                                    <p className="text-zinc-300 italic">"I can now support journalists in my country without risking arrest."</p>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <UserX className="h-4 w-4" />
                                        </div>
                                        Anonymous Supporter
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-white/5 relative z-10 transform -translate-x-4">
                                <CardContent className="p-6">
                                    <p className="text-zinc-300 italic">"Finally, I can fund causes I believe in without career consequences."</p>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <UserX className="h-4 w-4" />
                                        </div>
                                        Tech Worker, SF
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="w-full py-24 relative">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                            Three Simple Steps
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Supporting privately is easier than you think.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="relative p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-primary/20 transition-all group">
                            <div className="absolute -top-6 left-8 text-6xl font-bold text-zinc-800/50 group-hover:text-primary/10 transition-colors">1</div>
                            <h3 className="font-heading text-xl font-bold mb-3 relative z-10">Find a Creator</h3>
                            <p className="text-muted-foreground relative z-10">
                                Browse profiles. See their work. Choose who to support. No account required.
                            </p>
                        </div>
                        <div className="relative p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-primary/20 transition-all group">
                            <div className="absolute -top-6 left-8 text-6xl font-bold text-zinc-800/50 group-hover:text-primary/10 transition-colors">2</div>
                            <h3 className="font-heading text-xl font-bold mb-3 relative z-10">Send Private Payment</h3>
                            <p className="text-muted-foreground relative z-10">
                                Use Zcash to send completely untraceable payment. We guide you through every step.
                            </p>
                        </div>
                        <div className="relative p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-primary/20 transition-all group">
                            <div className="absolute -top-6 left-8 text-6xl font-bold text-zinc-800/50 group-hover:text-primary/10 transition-colors">3</div>
                            <h3 className="font-heading text-xl font-bold mb-3 relative z-10">Access Exclusive Content</h3>
                            <p className="text-muted-foreground relative z-10">
                                Prove you paid (without revealing your identity) to unlock articles, videos, and more.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 flex justify-center gap-4">
                        <Link href="/discover">
                            <Button size="lg" variant="glow">
                                Start Supporting
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
