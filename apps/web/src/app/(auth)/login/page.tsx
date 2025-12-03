'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@veil/ui';
import { api } from '../../../lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { token } = await api.auth.login(formData);
            localStorage.setItem('token', token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Form */}
            <div className="flex w-full flex-col justify-center p-8 lg:w-1/2 xl:w-2/5 relative z-10">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-8 space-y-2">
                        <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground">Log in to your account to continue supporting privacy.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter your password"
                            />
                        </div>

                        <Button type="submit" className="w-full h-11 text-base" disabled={loading} variant="glow">
                            {loading ? 'Logging in...' : 'Log in'}
                        </Button>

                        <div className="text-sm text-center text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex w-1/2 xl:w-3/5 bg-muted relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-zinc-900 to-zinc-900" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />

                <div className="relative z-10 p-12 text-center max-w-lg">
                    <h2 className="font-heading text-4xl font-bold text-white mb-4">Privacy is a Human Right</h2>
                    <p className="text-zinc-400 text-lg">
                        Veil empowers you to support the creators you love without compromising your financial privacy.
                    </p>
                </div>
            </div>
        </div>
    );
}
