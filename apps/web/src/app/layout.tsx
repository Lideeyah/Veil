import type { Metadata } from 'next';
import { Manrope, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/providers';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AiConcierge } from '../components/AiConcierge';
import { cn } from '@veil/ui';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
    title: 'Veil | Private Creator Patronage',
    description: 'Support creators privately using Zcash.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(
                manrope.variable,
                outfit.variable,
                "font-sans antialiased bg-background text-foreground min-h-screen flex flex-col"
            )}>
                <Providers>
                    <div className="relative flex min-h-screen flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                        <AiConcierge />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
