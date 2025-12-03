'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreatorAnalytics } from '@veil/types';
import { api } from '../../lib/api';
import { Button, Card, CardHeader, CardTitle, CardContent, CardDescription } from '@veil/ui';
import { Users, TrendingUp, DollarSign, Activity, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data for Chart
const chartData = [
    { name: 'Jan', supporters: 40, revenue: 2.4 },
    { name: 'Feb', supporters: 55, revenue: 3.8 },
    { name: 'Mar', supporters: 85, revenue: 6.2 },
    { name: 'Apr', supporters: 100, revenue: 8.5 },
    { name: 'May', supporters: 135, revenue: 11.2 },
    { name: 'Jun', supporters: 150, revenue: 12.5 },
];

// Mock Data for Activity
const recentActivity = [
    { id: 1, type: 'subscription', user: 'Anonymous', amount: '0.5 ZEC', time: '2 mins ago' },
    { id: 2, type: 'subscription', user: 'Anonymous', amount: '0.5 ZEC', time: '1 hour ago' },
    { id: 3, type: 'post', title: 'Exclusive: The Future of Privacy', time: '4 hours ago' },
    { id: 4, type: 'subscription', user: 'Anonymous', amount: '2.0 ZEC', time: '1 day ago' },
];

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<CreatorAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Mock ID for now
                const mockId = 'creator_tech';
                const data = await api.creators.getStats(mockId);
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-pulse text-primary font-heading text-xl">Loading dashboard...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 z-0 pointer-events-none" />

            <div className="container py-10 space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Overview of your creator journey</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">Manage Tiers</Button>
                        <Button variant="glow">New Post</Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="glass-card border-white/5 hover:border-primary/20 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Supporters</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold font-heading">{stats?.totalSupporters || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-400">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                {stats?.growthRate || 0}% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-white/5 hover:border-primary/20 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold font-heading">12.5 ZEC</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                ≈ $450.00 USD
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-white/5 hover:border-primary/20 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tiers</CardTitle>
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold font-heading">2</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across 150 subscribers
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-7">
                    {/* Growth Chart */}
                    <Card className="glass-card border-white/5 col-span-4">
                        <CardHeader>
                            <CardTitle>Growth Overview</CardTitle>
                            <CardDescription>Supporter growth over the last 6 months</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorSupporters" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#71717a"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#71717a"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="supporters"
                                            stroke="#8B5CF6"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorSupporters)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="glass-card border-white/5 col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest actions on your profile</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4">
                                        <div className={`mt-1 p-2 rounded-full ${activity.type === 'subscription' ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
                                            {activity.type === 'subscription' ? <ShieldCheck className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none text-white">
                                                {activity.type === 'subscription' ? (
                                                    <>New supporter contributed <span className="text-primary">{activity.amount}</span></>
                                                ) : (
                                                    activity.title
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
