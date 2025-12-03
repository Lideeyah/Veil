'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Textarea } from '@veil/ui';
import { api } from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Eye, EyeOff, Plus, Trash2, Shield, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showViewingKey, setShowViewingKey] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        displayName: '',
        bio: '',
    });

    // Mock Zcash Address (In real app, generated on backend or via WASM)
    const [zAddress] = useState('zs1x2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r');
    const [viewingKey] = useState('zxviews1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l0zxcvbnm');

    // Tiers State
    const [tiers, setTiers] = useState([
        { name: 'Supporter', amountZEC: '0.05', benefits: ['Monthly Newsletter', 'Supporter Badge'] }
    ]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const addTier = () => {
        if (tiers.length < 5) {
            setTiers([...tiers, { name: '', amountZEC: '', benefits: [''] }]);
        }
    };

    const removeTier = (index: number) => {
        setTiers(tiers.filter((_, i) => i !== index));
    };

    const updateTier = (index: number, field: string, value: any) => {
        const newTiers = [...tiers];
        // @ts-ignore
        newTiers[index][field] = value;
        setTiers(newTiers);
    };

    const updateBenefit = (tierIndex: number, benefitIndex: number, value: string) => {
        const newTiers = [...tiers];
        newTiers[tierIndex].benefits[benefitIndex] = value;
        setTiers(newTiers);
    };

    const addBenefit = (tierIndex: number) => {
        const newTiers = [...tiers];
        newTiers[tierIndex].benefits.push('');
        setTiers(newTiers);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            // 1. Register Creator
            const { token } = await api.auth.register(formData);
            localStorage.setItem('token', token);

            // 2. Create Tiers
            for (const tier of tiers) {
                if (tier.name && tier.amountZEC) {
                    await api.creators.createTier({
                        name: tier.name,
                        description: `${tier.name} Tier`,
                        amountZEC: parseFloat(tier.amountZEC),
                        benefits: tier.benefits.filter(b => b.trim() !== ''),
                    });
                }
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    return (
        <div className="min-h-screen w-full flex bg-background">
            {/* Left Side - Progress & Visuals */}
            <div className="hidden lg:flex w-1/3 bg-muted relative overflow-hidden flex-col p-12 justify-between border-r border-white/5">
                <div className="absolute inset-0 bg-zinc-900/90" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="relative z-10">
                    <Link href="/" className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" /> Veil
                    </Link>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="space-y-2">
                        <h2 className="font-heading text-3xl font-bold text-white">Create your profile</h2>
                        <p className="text-zinc-400">Follow the steps to set up your private patronage page.</p>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className={`flex items-center gap-4 ${step === s ? 'text-primary' : step > s ? 'text-white' : 'text-zinc-600'}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${step === s ? 'border-primary bg-primary/10' : step > s ? 'border-white bg-white/10' : 'border-zinc-700'}`}>
                                    {step > s ? <Check className="h-4 w-4" /> : s}
                                </div>
                                <span className="font-medium">
                                    {s === 1 && 'Basic Info'}
                                    {s === 2 && 'Zcash Address'}
                                    {s === 3 && 'Support Tiers'}
                                    {s === 4 && 'Review'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-sm text-zinc-500">
                    © 2024 Veil Platform. Privacy by default.
                </div>
            </div>

            {/* Right Side - Form Steps */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h1 className="font-heading text-3xl font-bold">Basic Information</h1>
                                    <p className="text-muted-foreground">Tell your supporters who you are.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                placeholder="username"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <Input
                                                id="displayName"
                                                value={formData.displayName}
                                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                                placeholder="My Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="What are you creating?"
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button onClick={handleNext} variant="glow" disabled={!formData.username || !formData.email || !formData.password}>
                                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h1 className="font-heading text-3xl font-bold">Your Private Address</h1>
                                    <p className="text-muted-foreground">We've generated a Zcash shielded address for you.</p>
                                </div>

                                <Card className="glass-card border-primary/20 bg-primary/5">
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-primary font-bold">Your Shielded Address (z-addr)</Label>
                                            <div className="flex gap-2">
                                                <div className="bg-background/50 p-3 rounded-md font-mono text-xs break-all border border-white/10 flex-1">
                                                    {zAddress}
                                                </div>
                                                <Button size="icon" variant="outline" onClick={() => copyToClipboard(zAddress)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Share this address to receive private payments.</p>
                                        </div>

                                        <div className="space-y-2 pt-4 border-t border-white/5">
                                            <Label className="text-amber-500 font-bold flex items-center gap-2">
                                                <EyeOff className="h-4 w-4" /> Viewing Key (Private)
                                            </Label>
                                            <div className="flex gap-2">
                                                <div className="bg-background/50 p-3 rounded-md font-mono text-xs break-all border border-white/10 flex-1 relative">
                                                    <div className={showViewingKey ? '' : 'blur-sm select-none'}>
                                                        {viewingKey}
                                                    </div>
                                                </div>
                                                <Button size="icon" variant="outline" onClick={() => setShowViewingKey(!showViewingKey)}>
                                                    {showViewingKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                                <Button size="icon" variant="outline" onClick={() => copyToClipboard(viewingKey)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-xs text-amber-500/80">
                                                ⚠️ Save this key! You need it to see your incoming payments. We encrypt it, but you should back it up.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex justify-between">
                                    <Button onClick={handleBack} variant="ghost">Back</Button>
                                    <Button onClick={handleNext} variant="glow">
                                        I've Saved My Key <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h1 className="font-heading text-3xl font-bold">Support Tiers</h1>
                                    <p className="text-muted-foreground">Define how supporters can fund your work.</p>
                                </div>

                                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                                    {tiers.map((tier, index) => (
                                        <Card key={index} className="glass-card relative">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                                                onClick={() => removeTier(index)}
                                                disabled={tiers.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Tier Name</Label>
                                                        <Input
                                                            value={tier.name}
                                                            onChange={(e) => updateTier(index, 'name', e.target.value)}
                                                            placeholder="e.g. Supporter"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Amount (ZEC)</Label>
                                                        <Input
                                                            value={tier.amountZEC}
                                                            onChange={(e) => updateTier(index, 'amountZEC', e.target.value)}
                                                            placeholder="0.05"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Benefits</Label>
                                                    {tier.benefits.map((benefit, bIndex) => (
                                                        <Input
                                                            key={bIndex}
                                                            value={benefit}
                                                            onChange={(e) => updateBenefit(index, bIndex, e.target.value)}
                                                            placeholder="Benefit description"
                                                            className="mb-2"
                                                        />
                                                    ))}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => addBenefit(index)}
                                                        className="text-xs"
                                                    >
                                                        <Plus className="h-3 w-3 mr-1" /> Add Benefit
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {tiers.length < 5 && (
                                        <Button onClick={addTier} variant="outline" className="w-full border-dashed">
                                            <Plus className="h-4 w-4 mr-2" /> Add Another Tier
                                        </Button>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <Button onClick={handleBack} variant="ghost">Back</Button>
                                    <Button onClick={handleNext} variant="glow">
                                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h1 className="font-heading text-3xl font-bold">Review & Launch</h1>
                                    <p className="text-muted-foreground">Ready to launch your private creator profile?</p>
                                </div>

                                <Card className="glass-card">
                                    <CardContent className="pt-6 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                                                {formData.displayName[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl">{formData.displayName}</h3>
                                                <p className="text-muted-foreground">@{formData.username}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Tiers:</span> {tiers.length}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Address:</span> Shielded
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                                                {error}
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={handleSubmit} className="w-full" variant="glow" size="lg" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Launching...
                                                </>
                                            ) : (
                                                'Launch Profile'
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>

                                <div className="flex justify-start">
                                    <Button onClick={handleBack} variant="ghost">Back</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
