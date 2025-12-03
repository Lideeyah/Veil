'use client';

import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@veil/ui';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl transition-all duration-300">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Shield className="h-6 w-6 text-primary relative z-10" />
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight">Veil</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/creators" className="text-sm font-medium transition-colors hover:text-primary">
                        Explore
                    </Link>
                    <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                        How it Works
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/login">
                            <Button variant="ghost">Log in</Button>
                        </Link>
                        <Link href="/register">
                            <Button>Start Creating</Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <Link href="/creators" className="block text-sm font-medium hover:text-primary">
                        Explore
                    </Link>
                    <Link href="/about" className="block text-sm font-medium hover:text-primary">
                        How it Works
                    </Link>
                    <div className="pt-4 space-y-2">
                        <Link href="/login" className="block w-full">
                            <Button variant="ghost" className="w-full justify-start">Log in</Button>
                        </Link>
                        <Link href="/register" className="block w-full">
                            <Button className="w-full justify-start">Start Creating</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
