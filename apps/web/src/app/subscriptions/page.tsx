'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@veil/ui';
import { ShieldCheck, Clock, AlertCircle, ArrowRight, Zap, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Subscription Data
const mockSubscriptions = [
    {
        id: '1',
        creator: 'PrivacyWatch',
        tier: 'Privacy Advocate',
        amount: '0.5 ZEC',
        status: 'active',
        expiresIn: '24 days',
        renewalDate: 'Nov 24, 2024',
        avatar: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: '2',
        creator: 'CryptoAnalyst',
        tier: 'Insider',
        amount: '1.0 ZEC',
        status: 'expiring_soon',
        expiresIn: '3 days',
        renewalDate: 'Nov 03, 2024',
        avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: '3',
        creator: 'TechTalks',
        tier: 'Supporter',
        amount: '0.1 ZEC',
        status: 'expired',
        expiresIn: 'Expired',
        renewalDate: 'Oct 28, 2024',
        avatar: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=2066&auto=format&fit=crop'
    }
];

export default function SubscriptionsPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 z-0 pointer-events-none" />

            <div className="container py-12 space-y-8 relative z-10">
                <div>
                    <h1 className="font-heading text-4xl font-bold mb-2">Subscriptions</h1>
                    <p className="text-muted-foreground text-lg">Manage your active support and renewals.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mockSubscriptions.map((sub, index) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`glass-card h-full border-white/5 overflow-hidden group ${sub.status === 'expired' ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all' : ''}`}>
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full overflow-hidden border border-white/10">
                                                <img src={sub.avatar} alt={sub.creator} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{sub.creator}</CardTitle>
                                                <p className="text-sm text-muted-foreground">{sub.tier}</p>
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${sub.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                sub.status === 'expiring_soon' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {sub.status === 'active' && 'Active'}
                                            {sub.status === 'expiring_soon' && 'Expiring Soon'}
                                            {sub.status === 'expired' && 'Expired'}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4 space-y-4">
                                    <div className="flex items-center justify-between text-sm p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                                        <span className="text-muted-foreground">Amount</span>
                                        <span className="font-mono font-bold text-white">{sub.amount}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Calendar className="h-3 w-3" /> Renewal Date
                                            </span>
                                            <span className="text-zinc-300">{sub.renewalDate}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Clock className="h-3 w-3" /> Time Remaining
                                            </span>
                                            <span className={`font-medium ${sub.status === 'expiring_soon' ? 'text-amber-500' :
                                                    sub.status === 'expired' ? 'text-red-500' : 'text-zinc-300'
                                                }`}>
                                                {sub.expiresIn}
                                            </span>
                                        </div>
                                    </div>

                                    {sub.status === 'active' && (
                                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-3/4" />
                                        </div>
                                    )}
                                    {sub.status === 'expiring_soon' && (
                                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 w-[90%]" />
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-0">
                                    {sub.status === 'expired' ? (
                                        <Button className="w-full" variant="glow">
                                            <Zap className="mr-2 h-4 w-4" /> Renew Now
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2 w-full">
                                            <Button variant="outline" className="flex-1">
                                                Manage
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                                Extend
                                            </Button>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Add New Subscription Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href="/discover">
                            <Card className="glass-card h-full border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center p-8 group cursor-pointer min-h-[300px]">
                                <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/5">
                                    <ShieldCheck className="h-8 w-8 text-zinc-500 group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Find More Creators</h3>
                                <p className="text-sm text-muted-foreground text-center max-w-[200px]">
                                    Discover independent journalists and researchers to support.
                                </p>
                            </Card>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
