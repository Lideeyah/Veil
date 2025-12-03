'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { CreatorProfile } from '@veil/types';
import { api } from '../../../lib/api';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@veil/ui';
import { Shield, Lock, Check, Star, Users, FileText, Image, Video, Music } from 'lucide-react';
import { PaymentModal } from '../../../components/payment/PaymentModal';
import { motion } from 'framer-motion';

// Mock Content Previews
const MOCK_CONTENT_PREVIEWS = [
    { id: 1, title: 'Deep Dive: The Future of Privacy', type: 'article', date: '2 days ago', tier: 'Patron', locked: true },
    { id: 2, title: 'Exclusive Interview with Whistleblower', type: 'video', date: '5 days ago', tier: 'Inner Circle', locked: true },
    { id: 3, title: 'Weekly Update: Surveillance Tech', type: 'audio', date: '1 week ago', tier: 'Supporter', locked: true },
];

export default function CreatorProfilePage() {
    const params = useParams();
    const { data: profile, isLoading: loading, error } = useQuery({
        queryKey: ['creator', params.username],
        queryFn: () => api.creators.getProfile(params.username as string),
        enabled: !!params.username
    });

    const [activeTab, setActiveTab] = useState('about');

    // Payment Modal State
    const [selectedTier, setSelectedTier] = useState<any>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const handleSubscribe = (tier: any) => {
        setSelectedTier(tier);
        setIsPaymentOpen(true);
    };

    const scrollToSection = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading) return <div className="container py-10 text-center">Loading profile...</div>;
    if (error) return <div className="container py-10 text-center text-red-500">{(error as Error).message || 'Failed to load profile'}</div>;
    if (!profile) return <div className="container py-10 text-center">Creator not found</div>;

    return (
        <div className="min-h-screen bg-background relative">
            {/* Cover Image */}
            <div className="h-80 w-full bg-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                <img
                    src={profile.profileImageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            <div className="container px-4 md:px-6 relative z-20 -mt-32">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Profile Info */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-end gap-6">
                            <div className="h-40 w-40 rounded-full border-4 border-background bg-zinc-800 overflow-hidden shadow-2xl">
                                {profile.profileImageUrl ? (
                                    <img src={profile.profileImageUrl} alt={profile.displayName} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-primary/20 text-4xl font-bold text-primary">
                                        {profile.displayName[0]}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4 space-y-1">
                                <h1 className="font-heading text-4xl font-bold">{profile.displayName}</h1>
                                <p className="text-muted-foreground text-lg">@{profile.username}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-white/5">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="font-bold text-white">142</span>
                                <span className="text-muted-foreground">Private Supporters</span>
                            </div>
                            <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-white/5">
                                <Shield className="h-4 w-4 text-green-500" />
                                <span className="text-muted-foreground">Verified Creator</span>
                            </div>
                        </div>

                        <p className="text-lg leading-relaxed max-w-2xl text-zinc-300">
                            {profile.bio || "Investigative journalist covering surveillance capitalism and digital privacy. Your support helps me stay independent."}
                        </p>
                    </div>

                    {/* Quick Support CTA (Desktop) */}
                    <div className="hidden md:block w-80 sticky top-24">
                        <Card className="glass-card border-primary/20 bg-primary/5">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-bold text-lg">Support {profile.displayName}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Join 142 others supporting independent work privately.
                                </p>
                                <Button className="w-full" variant="glow" onClick={() => scrollToSection('tiers')}>
                                    Choose a Tier
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Sticky Navigation */}
                <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 mt-12 mb-12 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar py-4">
                        {['about', 'tiers', 'content'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => scrollToSection(tab)}
                                className={`text-sm font-bold uppercase tracking-wide border-b-2 pb-1 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-24 pb-24">
                    {/* About Section */}
                    <section id="about" className="scroll-mt-32">
                        <h2 className="font-heading text-2xl font-bold mb-6">About</h2>
                        <div className="prose prose-invert max-w-none">
                            <p>
                                I've been reporting on tech policy for over a decade. Traditional media outlets are often beholden to corporate advertisers, limiting what can be investigated.
                            </p>
                            <p>
                                By supporting me directly on Veil, you're funding independent, fearless journalism that holds power to account. And because Veil uses Zcash, your support is completely private—no one can track your financial history or use it against you.
                            </p>
                        </div>
                    </section>

                    {/* Tiers Section */}
                    <section id="tiers" className="scroll-mt-32">
                        <h2 className="font-heading text-2xl font-bold mb-6">Select a Membership Level</h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {profile.tiers.map((tier, index) => (
                                <motion.div
                                    key={tier.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={`glass-card flex flex-col h-full border-white/5 hover:border-primary/30 transition-all duration-300 group relative ${index === 1 ? 'border-primary/50 bg-primary/5' : ''}`}>
                                        {index === 1 && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                BEST VALUE
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="font-heading text-2xl">{tier.name}</CardTitle>
                                            <div className="flex items-baseline gap-1 mt-2">
                                                <span className="text-3xl font-bold">${tier.amountUSD || '5'}</span>
                                                <span className="text-muted-foreground">/month</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground font-mono">
                                                ≈ {tier.amountZEC} ZEC
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 space-y-6">
                                            <ul className="space-y-3">
                                                {tier.benefits.map((benefit, i) => (
                                                    <li key={i} className="flex items-start text-sm text-zinc-300">
                                                        <Check className="h-5 w-5 mr-3 text-primary shrink-0" />
                                                        {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" variant={index === 1 ? 'glow' : 'outline'} onClick={() => handleSubscribe(tier)}>
                                                Join for ${tier.amountUSD || '5'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Content Preview Section */}
                    <section id="content" className="scroll-mt-32">
                        <h2 className="font-heading text-2xl font-bold mb-6">Recent Content</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {MOCK_CONTENT_PREVIEWS.map((content) => (
                                <Card key={content.id} className="glass-card border-white/5 overflow-hidden group hover:border-primary/30 transition-colors">
                                    <div className="h-40 bg-zinc-900 relative flex items-center justify-center">
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                            <Lock className="h-8 w-8 text-white/50" />
                                        </div>
                                        {content.type === 'article' && <FileText className="h-12 w-12 text-zinc-700" />}
                                        {content.type === 'video' && <Video className="h-12 w-12 text-zinc-700" />}
                                        {content.type === 'audio' && <Music className="h-12 w-12 text-zinc-700" />}
                                    </div>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="capitalize flex items-center gap-1">
                                                {content.type === 'article' && <FileText className="h-3 w-3" />}
                                                {content.type}
                                            </span>
                                            <span>{content.date}</span>
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                            {content.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 w-fit px-2 py-1 rounded">
                                            <Star className="h-3 w-3" />
                                            {content.tier} Only
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Button variant="ghost" className="w-full text-xs" onClick={() => scrollToSection('tiers')}>
                                            Unlock this post
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Payment Modal */}
            {selectedTier && (
                <PaymentModal
                    isOpen={isPaymentOpen}
                    onClose={() => setIsPaymentOpen(false)}
                    creatorId={profile.id}
                    tierId={selectedTier.id}
                    amountZEC={selectedTier.amountZEC.toString()}
                    amountUSD={selectedTier.amountUSD?.toString()}
                />
            )}
        </div>
    );
}
