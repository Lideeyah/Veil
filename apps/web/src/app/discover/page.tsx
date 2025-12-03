'use client';

import { useState } from 'react';
import { Button, Input, Card, CardContent } from '@veil/ui';
import { Search, Filter, Users, Layers, FileText, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const CATEGORIES = ['All', 'Journalism', 'Activism', 'Research', 'Open Source', 'Art'];

export default function DiscoverPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const { data: creators, isLoading, error } = useQuery({
        queryKey: ['creators'],
        queryFn: api.creators.getAll
    });

    const filteredCreators = creators?.filter(creator => {
        const matchesSearch = creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (creator.bio || '').toLowerCase().includes(searchQuery.toLowerCase());
        // Note: Category filtering would need category data in the API response.
        // For now, we'll assume 'All' or match if we add categories later.
        const matchesCategory = selectedCategory === 'All';
        return matchesSearch && matchesCategory;
    }) || [];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-zinc-900/50 border-b border-white/5 py-12">
                <div className="container px-4 md:px-6">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Discover Creators</h1>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        Find journalists, activists, and researchers to support privately.
                    </p>

                    {/* Search & Filter */}
                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, topic, or keyword..."
                                className="pl-10 h-12 bg-zinc-950/50 border-white/10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            {CATEGORIES.map(category => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? 'glow' : 'outline'}
                                    onClick={() => setSelectedCategory(category)}
                                    className="whitespace-nowrap"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Creator Grid */}
            <div className="container px-4 md:px-6 py-12">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">
                        Failed to load creators. Please try again.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredCreators.map((creator, index) => (
                            <motion.div
                                key={creator.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/creators/${creator.username}`}>
                                    <Card className="glass-card h-full hover:border-primary/50 transition-all duration-300 group overflow-hidden flex flex-col">
                                        {/* Cover Image */}
                                        <div className="h-32 bg-zinc-800 relative">
                                            {creator.coverImageUrl ? (
                                                <img src={creator.coverImageUrl} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                                            )}
                                        </div>

                                        <CardContent className="pt-12 relative flex-1 flex flex-col">
                                            {/* Avatar */}
                                            <div className="absolute -top-10 left-4">
                                                <div className="h-20 w-20 rounded-full border-4 border-zinc-950 overflow-hidden bg-zinc-800">
                                                    {creator.profileImageUrl ? (
                                                        <img src={creator.profileImageUrl} alt={creator.displayName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-2xl font-bold text-zinc-500">
                                                            {creator.displayName[0]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h3 className="font-heading text-lg font-bold group-hover:text-primary transition-colors">{creator.displayName}</h3>
                                                <p className="text-sm text-muted-foreground">@{creator.username}</p>
                                            </div>

                                            <p className="text-sm text-zinc-300 mb-6 line-clamp-2 flex-1">
                                                {creator.bio || 'No bio available.'}
                                            </p>

                                            <div className="grid grid-cols-3 gap-2 py-4 border-t border-white/5 mb-4">
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center text-primary mb-1">
                                                        <Users className="h-4 w-4" />
                                                    </div>
                                                    <div className="text-xs font-bold">{(creator as any).stats?.supporters || 0}</div>
                                                    <div className="text-[10px] text-muted-foreground">Supporters</div>
                                                </div>
                                                <div className="text-center border-l border-white/5">
                                                    <div className="flex items-center justify-center text-violet-400 mb-1">
                                                        <Layers className="h-4 w-4" />
                                                    </div>
                                                    <div className="text-xs font-bold">{creator.tiers?.length || 0}</div>
                                                    <div className="text-[10px] text-muted-foreground">Tiers</div>
                                                </div>
                                                <div className="text-center border-l border-white/5">
                                                    <div className="flex items-center justify-center text-indigo-400 mb-1">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <div className="text-xs font-bold">?</div>
                                                    <div className="text-[10px] text-muted-foreground">Posts</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                                <div className="text-xs text-muted-foreground">
                                                    Starts at <span className="font-bold text-white">{(creator as any).stats?.minTierPrice || '0'} ZEC</span>
                                                </div>
                                                <Button size="sm" variant="ghost" className="group-hover:text-primary group-hover:bg-primary/10">
                                                    View Profile <ArrowRight className="ml-1 h-3 w-3" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!isLoading && !error && filteredCreators.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">No creators found matching your search.</p>
                        <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
