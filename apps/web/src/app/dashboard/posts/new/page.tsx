'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Textarea, Card, CardContent, CardHeader, CardTitle } from '@veil/ui';
import { Upload, Lock, Eye, FileText, Image as ImageIcon, Video, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate upload
        setTimeout(() => {
            setLoading(false);
            router.push('/dashboard');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 z-0 pointer-events-none" />

            <div className="container max-w-3xl py-12 space-y-8 relative z-10">
                <div className="space-y-2">
                    <h1 className="font-heading text-3xl font-bold">Create New Post</h1>
                    <p className="text-muted-foreground">Share encrypted content with your supporters.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* File Upload Area */}
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${dragActive ? 'border-primary bg-primary/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleChange}
                        />

                        {file ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="font-medium text-lg">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); setFile(null); }}>
                                    <X className="mr-2 h-4 w-4" /> Remove
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <Upload className="h-8 w-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium text-lg">Drag and drop your file here</p>
                                    <p className="text-sm text-muted-foreground">or click to browse</p>
                                </div>
                                <div className="flex gap-4 text-xs text-zinc-500 mt-4">
                                    <span className="flex items-center gap-1"><Video className="h-3 w-3" /> Video</span>
                                    <span className="flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Image</span>
                                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> Text</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <Card className="glass-card border-white/5">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Post Title</Label>
                                <Input id="title" placeholder="e.g. Exclusive Behind the Scenes" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Tell your supporters about this content..."
                                    className="min-h-[150px] bg-background/50"
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <Label>Access Settings</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg border border-primary/50 bg-primary/5 cursor-pointer relative">
                                        <div className="absolute top-3 right-3 h-4 w-4 rounded-full border-2 border-primary bg-primary" />
                                        <div className="flex items-center gap-3 mb-2">
                                            <Lock className="h-5 w-5 text-primary" />
                                            <span className="font-bold">Supporters Only</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Encrypted client-side. Only supporters with a valid payment proof can decrypt.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 cursor-pointer relative hover:border-zinc-700 transition-colors">
                                        <div className="absolute top-3 right-3 h-4 w-4 rounded-full border-2 border-zinc-600" />
                                        <div className="flex items-center gap-3 mb-2">
                                            <Eye className="h-5 w-5 text-zinc-400" />
                                            <span className="font-bold text-zinc-300">Public Preview</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Visible to everyone. Good for teasers and announcements.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button variant="glow" type="submit" disabled={loading || !file}>
                            {loading ? 'Encrypting & Uploading...' : 'Publish Post'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
