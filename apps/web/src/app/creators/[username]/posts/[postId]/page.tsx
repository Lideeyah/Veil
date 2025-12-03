'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { Button, Card, CardContent } from '@veil/ui';
import { Lock, Unlock, Play, FileText, Music, Share2, ShieldCheck, Loader2, Download, Maximize2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PostPage() {
    const params = useParams();
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [decryptionProgress, setDecryptionProgress] = useState(0);
    const [commitment, setCommitment] = useState('');
    const [showCommitmentInput, setShowCommitmentInput] = useState(false);
    const [error, setError] = useState('');

    const { data: content, isLoading } = useQuery({
        queryKey: ['content', params.postId],
        queryFn: () => api.content.get(params.postId as string),
        enabled: !!params.postId
    });

    const handleUnlock = async () => {
        if (!commitment) {
            setShowCommitmentInput(true);
            return;
        }

        setIsDecrypting(true);
        setError('');

        try {
            // Verify access and get decryption key
            const response = await api.payments.proveAccess(commitment, params.postId as string, content.creatorId);

            // In a real app, we would use response.decryptionKey to decrypt content.encryptedContentKey
            // and then decrypt the actual content.
            // For this demo, we'll simulate the decryption delay and then show the content.

            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                setDecryptionProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    setIsDecrypting(false);
                    setIsUnlocked(true);
                }
            }, 50);

        } catch (err: any) {
            setIsDecrypting(false);
            setError(err.message || 'Invalid commitment key or access denied');
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (!content) return <div className="min-h-screen flex items-center justify-center">Content not found</div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero / Media Player Area */}
            <div className={`w-full bg-black relative flex items-center justify-center overflow-hidden border-b border-white/10 ${content.contentType === 'article' ? 'h-96' : 'aspect-video max-h-[80vh]'}`}>

                {/* Background for Article Mode */}
                {content.contentType === 'article' && (
                    <div className="absolute inset-0">
                        <img
                            src={content.thumbnailUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"}
                            alt="Cover"
                            className="w-full h-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>
                )}

                {!isUnlocked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-md z-10 p-6 text-center">
                        <div className="max-w-md space-y-6">
                            <div className="mx-auto h-20 w-20 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/10 shadow-2xl">
                                <Lock className="h-8 w-8 text-zinc-400" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold font-heading">Encrypted Content</h2>
                                <p className="text-muted-foreground">
                                    This content is encrypted client-side. You need a valid payment proof to decrypt it.
                                </p>
                            </div>

                            {showCommitmentInput && (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Enter your Secret Key"
                                        className="w-full bg-zinc-950 border border-white/10 rounded-md px-4 py-2 text-center font-mono text-sm"
                                        value={commitment}
                                        onChange={(e) => setCommitment(e.target.value)}
                                    />
                                    {error && <p className="text-red-500 text-xs">{error}</p>}
                                </div>
                            )}

                            {isDecrypting ? (
                                <div className="space-y-4 w-full">
                                    <div className="flex justify-between text-sm text-zinc-400">
                                        <span>Decrypting...</span>
                                        <span>{decryptionProgress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-primary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${decryptionProgress}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Verifying ZK Proof...
                                    </div>
                                </div>
                            ) : (
                                <Button size="lg" variant="glow" onClick={handleUnlock} className="w-full">
                                    <Unlock className="mr-2 h-4 w-4" /> {showCommitmentInput ? 'Decrypt Now' : 'Unlock Content'}
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        {content.contentType === 'video' && (
                            <div className="w-full h-full relative group">
                                <video
                                    src={content.storageHash} // Assuming storageHash is URL for now
                                    controls
                                    className="w-full h-full object-contain"
                                    poster={content.thumbnailUrl}
                                />
                            </div>
                        )}

                        {content.contentType === 'article' && (
                            <div className="text-center z-10 space-y-4 px-4">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/20">
                                    <FileText className="h-4 w-4" /> Article Unlocked
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold font-heading max-w-4xl leading-tight">
                                    {content.title}
                                </h1>
                            </div>
                        )}

                        {content.contentType === 'audio' && (
                            <div className="w-full max-w-3xl bg-zinc-900/90 backdrop-blur rounded-2xl p-8 border border-white/10 shadow-2xl">
                                <div className="flex items-center gap-6">
                                    <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg">
                                        <Music className="h-10 w-10 text-white" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-xl font-bold">{content.title}</h3>
                                        <p className="text-muted-foreground">{content.creator.displayName}</p>
                                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full w-1/3 bg-primary" />
                                        </div>
                                        <div className="flex justify-between text-xs text-zinc-500">
                                            <span>12:45</span>
                                            <span>45:00</span>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="glow" className="h-12 w-12 rounded-full">
                                        <Play className="h-5 w-5 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Content Body (For Article) or Details (For Video/Audio) */}
            <div className="container max-w-3xl mx-auto relative z-20 px-4 mt-8">
                {content.contentType === 'article' && isUnlocked ? (
                    <article className="prose prose-invert prose-lg max-w-none">
                        {/* In real app, we would decrypt this. For now, using description or placeholder */}
                        <div dangerouslySetInnerHTML={{ __html: content.description || '<p>Content decrypted.</p>' }} />
                    </article>
                ) : (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-white/5 pb-8">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold font-heading">{content.title}</h1>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        {content.creator.displayName}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(content.publishedAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{content.durationSeconds ? Math.floor(content.durationSeconds / 60) + ' min' : 'Read'}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" /> Download
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg text-zinc-300 leading-relaxed">
                                {content.description}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
