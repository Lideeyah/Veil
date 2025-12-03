'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Button, Card, CardContent, CardFooter, Input } from '@veil/ui';
import { Search, Play, FileText, Music, Lock, Filter, User, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Content Data
const mockContent = [
    {
        id: '1',
        title: 'The Future of Privacy Tech',
        creator: 'PrivacyWatch',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        locked: false,
        date: '2 days ago',
        duration: '15:30',
        progress: 0,
        unread: true
    },
    {
        id: '2',
        title: 'Q4 Research Report',
        creator: 'CryptoAnalyst',
        type: 'article',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
        locked: true,
        date: '5 days ago',
        readTime: '10 min read',
        progress: 0,
        unread: true
    },
    {
        id: '3',
        title: 'Weekly Podcast #42',
        creator: 'TechTalks',
        type: 'audio',
        thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=2066&auto=format&fit=crop',
        locked: false,
        date: '1 week ago',
        duration: '45:00',
        progress: 75,
        unread: false
    },
    {
        id: '4',
        title: 'Exclusive: Zero Knowledge Deep Dive',
        creator: 'ZK_Researcher',
        type: 'article',
        thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop',
        locked: true,
        date: '2 weeks ago',
        readTime: '25 min read',
        progress: 0,
        unread: true
    },
    {
        id: '5',
        title: 'Behind the Scenes: Setup Tour',
        creator: 'IndieDev',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?q=80&w=2069&auto=format&fit=crop',
        locked: true,
        date: '3 weeks ago',
        duration: '20:00',
        progress: 100,
        unread: false
    },
    {
        id: '6',
        title: 'Ambient Coding Mix',
        creator: 'LoFi_Beats',
        type: 'audio',
        thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop',
        locked: false,
        date: '1 month ago',
        duration: '1:00:00',
        progress: 30,
        unread: false
    }
];

const CREATORS = ['All Creators', 'PrivacyWatch', 'CryptoAnalyst', 'TechTalks', 'ZK_Researcher', 'IndieDev', 'LoFi_Beats'];

export default function LibraryPage() {
    const [filterType, setFilterType] = useState('all');
    const [selectedCreator, setSelectedCreator] = useState('All Creators');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const [search, setSearch] = useState('');

    const { data: content, isLoading, error } = useQuery({
        queryKey: ['content', filterType, selectedCreator, search],
        queryFn: () => api.content.list({
            type: filterType === 'all' ? undefined : filterType,
            creatorId: selectedCreator === 'All Creators' ? undefined : undefined, // We need creator ID, not name. 
            // The mock data used names. The API needs IDs.
            // We need to fetch creators first to map names to IDs or change the UI to use IDs.
            // For now, let's just search by text if "All Creators" is not selected, or ignore creator filter if we don't have IDs.
            // Ideally we fetch creators list too.
            search: search || undefined
        })
    });

    // We need to fetch creators to populate the filter tabs properly with IDs
    const { data: creators } = useQuery({
        queryKey: ['creators'],
        queryFn: api.creators.getAll
    });

    const filteredContent = content?.filter(item => {
        // Client-side filtering for "Unread" since API doesn't support it yet (no auth)
        const matchesUnread = !showUnreadOnly || item.unread;
        // Creator filter is tricky if we don't pass it to API.
        // If we pass it to API, we need the ID.
        // Let's assume we filter by creator name client side for now if API returns all, 
        // OR we update the UI to use IDs.
        const matchesCreator = selectedCreator === 'All Creators' || item.creator === selectedCreator;
        return matchesUnread && matchesCreator;
    }) || [];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 z-0 pointer-events-none" />

            <div className="container py-12 space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="font-heading text-4xl font-bold mb-2">Library</h1>
                        <p className="text-muted-foreground text-lg">Your collection of unlocked content.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search library..."
                                className="pl-9 w-full sm:w-[300px] bg-background/50 backdrop-blur-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Creator Tabs */}
                <div className="border-b border-white/5 overflow-x-auto no-scrollbar">
                    <div className="flex gap-6 pb-2">
                        {CREATORS.map((creator) => (
                            <button
                                key={creator}
                                onClick={() => setSelectedCreator(creator)}
                                className={`text-sm font-bold whitespace-nowrap pb-2 border-b-2 transition-colors ${selectedCreator === creator
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-white'
                                    }`}
                            >
                                {creator}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {['all', 'video', 'article', 'audio'].map((type) => (
                            <Button
                                key={type}
                                variant={filterType === type ? 'glow' : 'outline'}
                                onClick={() => setFilterType(type)}
                                className="capitalize h-9 text-xs"
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-white/10 hidden sm:block" />
                    <Button
                        variant={showUnreadOnly ? 'glow' : 'outline'}
                        onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                        className="h-9 text-xs gap-2"
                    >
                        <CheckCircle2 className="h-3 w-3" />
                        Unread Only
                    </Button>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredContent.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={`/creators/${item.creator}/posts/${item.id}`}>
                                <Card className="glass-card h-full hover:border-primary/30 transition-all duration-300 group overflow-hidden border-white/5 flex flex-col">
                                    <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />

                                        {/* Progress Bar */}
                                        {item.progress > 0 && (
                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>
                                        )}

                                        {/* Type Icon Overlay */}
                                        <div className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/80">
                                            {item.type === 'video' && <Play className="h-4 w-4" />}
                                            {item.type === 'article' && <FileText className="h-4 w-4" />}
                                            {item.type === 'audio' && <Music className="h-4 w-4" />}
                                        </div>

                                        {/* Lock Status */}
                                        {item.locked && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                                                <div className="flex flex-col items-center gap-2 text-white/80">
                                                    <Lock className="h-8 w-8" />
                                                    <span className="text-xs font-medium uppercase tracking-wider">Locked</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Play Overlay (Hover) */}
                                        {!item.locked && (
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                                                    <Play className="h-6 w-6 fill-current" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-5 space-y-3 flex-1">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-heading font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                    {item.title}
                                                </h3>
                                                {item.unread && (
                                                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="h-3 w-3" />
                                                {item.creator}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-5 pb-5 pt-0 flex justify-between text-xs text-zinc-500 border-t border-white/5 mt-auto pt-4">
                                        <span>{item.date}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {item.duration || item.readTime}
                                        </span>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {filteredContent.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">No content found matching your filters.</p>
                        <Button variant="link" onClick={() => { setFilterType('all'); setSearch(''); setSelectedCreator('All Creators'); setShowUnreadOnly(false); }} className="mt-2">
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
