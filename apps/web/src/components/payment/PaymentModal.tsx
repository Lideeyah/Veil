'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Input, Label, Card } from '@veil/ui';
import { api } from '../../lib/api';
import { generateBrowserCommitment, constructPaymentURI, encodeMemoData } from '../../lib/zcash';
import { Loader2, CheckCircle, Copy, Smartphone, Type, ShieldCheck, ArrowRight, Download, Info, Eye, Key, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    creatorId: string;
    tierId: string;
    amountZEC: string;
    amountUSD?: string;
}

const PrivacyExplainer = ({ onComplete }: { onComplete: () => void }) => {
    const steps = [
        {
            icon: <Eye className="h-12 w-12 text-primary" />,
            title: "Truly Private",
            description: "Veil uses Zcash to hide your transaction history. No one knows who you support."
        },
        {
            icon: <Key className="h-12 w-12 text-primary" />,
            title: "Your Secret Key",
            description: "We'll generate a unique secret key for you. This is your ONLY way to access content."
        },
        {
            icon: <Wallet className="h-12 w-12 text-primary" />,
            title: "Direct Payment",
            description: "You send Zcash directly to the creator. No middlemen, no censorship."
        }
    ];

    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="py-8 px-4 flex flex-col items-center text-center space-y-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <div className="p-6 rounded-full bg-primary/10 mb-4">
                        {steps[currentStep].icon}
                    </div>
                    <h3 className="text-2xl font-bold font-heading">{steps[currentStep].title}</h3>
                    <p className="text-zinc-400 max-w-xs">{steps[currentStep].description}</p>
                </motion.div>
            </AnimatePresence>

            <div className="flex gap-2">
                {steps.map((_, i) => (
                    <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i === currentStep ? 'bg-primary' : 'bg-zinc-800'}`} />
                ))}
            </div>

            <Button
                className="w-full"
                variant="glow"
                onClick={() => {
                    if (currentStep < steps.length - 1) {
                        setCurrentStep(c => c + 1);
                    } else {
                        onComplete();
                    }
                }}
            >
                {currentStep < steps.length - 1 ? "Next" : "I Understand"}
            </Button>
        </div>
    );
};

export function PaymentModal({ isOpen, onClose, creatorId, tierId, amountZEC, amountUSD }: PaymentModalProps) {
    const [step, setStep] = useState<'explainer' | 'commitment' | 'payment' | 'success'>('explainer');
    const [paymentData, setPaymentData] = useState<any>(null);
    const [commitment, setCommitment] = useState('');
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'scan' | 'manual' | 'guide'>('scan');
    const [memo, setMemo] = useState('');
    const [hasSavedKey, setHasSavedKey] = useState(false);

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setStep('explainer');
            setPaymentData(null);
            setError('');
            setMode('scan');
            setHasSavedKey(false);
        }
    }, [isOpen]);

    const generateKey = () => {
        const newCommitment = generateBrowserCommitment();
        setCommitment(newCommitment);
        setStep('commitment');
    };

    const initiatePayment = async () => {
        try {
            // Get payment details from server
            const data = await api.payments.initiate({ creatorId, tierId });

            // Construct full memo with client commitment
            const memoData = {
                ...data.memoTemplate,
                commitment: commitment,
            };

            const encodedMemo = encodeMemoData(memoData);
            const uri = constructPaymentURI(data.zcashAddress, data.amountZEC, encodedMemo);

            setPaymentData({ ...data, uri });
            setMemo(encodedMemo);
            setStep('payment');
        } catch (err: any) {
            setError(err.message || 'Failed to initiate payment');
        }
    };

    // Poll for verification
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (step === 'payment') {
            interval = setInterval(async () => {
                try {
                    const result = await api.payments.verify({ commitment, creatorId });
                    if (result.valid) {
                        setStep('success');
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#7C3AED', '#A855F7', '#ffffff']
                        });
                        clearInterval(interval);
                    }
                } catch (err) {
                    // Ignore 404s while waiting
                }
            }, 3000);
        }

        return () => clearInterval(interval);
    }, [step, commitment, creatorId]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const downloadKey = () => {
        const element = document.createElement("a");
        const file = new Blob([commitment], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "veil-secret-key.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-zinc-950/95 backdrop-blur-xl border-white/10 text-white overflow-hidden">
                <AnimatePresence mode="wait">
                    {step === 'explainer' && (
                        <motion.div
                            key="explainer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <PrivacyExplainer onComplete={generateKey} />
                        </motion.div>
                    )}

                    {step === 'commitment' && (
                        <motion.div
                            key="commitment"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 py-6"
                        >
                            <DialogHeader>
                                <DialogTitle className="text-center font-heading text-2xl">Save Your Secret Key</DialogTitle>
                                <DialogDescription className="text-center text-zinc-400">
                                    This key is the ONLY way to access your content. If you lose it, you lose access.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="bg-zinc-900/50 p-6 rounded-xl border border-red-500/20 space-y-4">
                                <div className="font-mono text-center text-xl text-primary break-all font-bold tracking-wider">
                                    {commitment}
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(commitment)}>
                                        <Copy className="h-4 w-4 mr-2" /> Copy
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={downloadKey}>
                                        <Download className="h-4 w-4 mr-2" /> Download
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 p-4 rounded-lg border border-white/5 bg-zinc-900/30 cursor-pointer hover:bg-zinc-900/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-zinc-700 bg-zinc-800 text-primary focus:ring-primary"
                                        checked={hasSavedKey}
                                        onChange={(e) => setHasSavedKey(e.target.checked)}
                                    />
                                    <span className="text-sm text-zinc-300">I have saved my secret key securely</span>
                                </label>

                                <Button
                                    className="w-full"
                                    variant="glow"
                                    disabled={!hasSavedKey}
                                    onClick={initiatePayment}
                                >
                                    Continue to Payment
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'payment' && paymentData && (
                        <motion.div
                            key="payment"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-heading text-center">Complete Payment</DialogTitle>
                                <DialogDescription className="text-center text-zinc-400">
                                    Send exactly <span className="text-white font-bold">{amountZEC} ZEC</span>
                                </DialogDescription>
                            </DialogHeader>

                            {/* Tabs */}
                            <div className="flex p-1 bg-zinc-900/50 rounded-lg border border-white/5">
                                <button
                                    onClick={() => setMode('scan')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'scan' ? 'bg-primary/20 text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    <Smartphone className="h-4 w-4 mx-auto mb-1" />
                                    Scan
                                </button>
                                <button
                                    onClick={() => setMode('manual')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'manual' ? 'bg-primary/20 text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    <Type className="h-4 w-4 mx-auto mb-1" />
                                    Manual
                                </button>
                                <button
                                    onClick={() => setMode('guide')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'guide' ? 'bg-primary/20 text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    <Info className="h-4 w-4 mx-auto mb-1" />
                                    Guide
                                </button>
                            </div>

                            <div className="min-h-[300px] flex flex-col items-center">
                                {mode === 'scan' && (
                                    <div className="space-y-6 w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                                        <div className="p-4 bg-white rounded-xl shadow-2xl shadow-primary/10">
                                            <QRCodeSVG value={paymentData.uri} size={180} />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Amount to Send</p>
                                            <p className="text-3xl font-bold font-heading text-white">{amountZEC} ZEC</p>
                                            {amountUSD && <p className="text-sm text-zinc-500">≈ ${amountUSD} USD</p>}
                                        </div>
                                    </div>
                                )}

                                {mode === 'manual' && (
                                    <div className="space-y-4 w-full animate-in fade-in slide-in-from-bottom-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-zinc-500">Shielded Address</Label>
                                            <div className="flex gap-2">
                                                <div className="bg-zinc-900/50 p-3 rounded-md font-mono text-xs text-zinc-300 break-all border border-white/5 flex-1">
                                                    {paymentData.zcashAddress}
                                                </div>
                                                <Button size="icon" variant="outline" className="shrink-0" onClick={() => copyToClipboard(paymentData.zcashAddress)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-amber-500">Memo (Required)</Label>
                                            <div className="flex gap-2">
                                                <div className="bg-amber-500/5 p-3 rounded-md font-mono text-xs text-amber-200/80 break-all border border-amber-500/20 flex-1">
                                                    {memo}
                                                </div>
                                                <Button size="icon" variant="outline" className="shrink-0 border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-500" onClick={() => copyToClipboard(memo)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-[10px] text-amber-500/60">
                                                You MUST include this memo for the payment to be detected.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {mode === 'guide' && (
                                    <div className="space-y-4 w-full text-sm text-zinc-400 animate-in fade-in slide-in-from-bottom-4">
                                        <p>We recommend using <strong>Zashi</strong> or <strong>Nighthawk</strong> wallet.</p>
                                        <ol className="list-decimal list-inside space-y-2">
                                            <li>Open your Zcash wallet app.</li>
                                            <li>Tap <strong>Send</strong>.</li>
                                            <li>Scan the QR code or paste the address.</li>
                                            <li><strong>IMPORTANT:</strong> Ensure the Memo field is populated with the code shown in the Manual tab.</li>
                                            <li>Confirm and send.</li>
                                        </ol>
                                        <div className="p-3 bg-primary/10 rounded border border-primary/20 text-primary text-xs">
                                            Transactions typically take 1-2 minutes to confirm on the blockchain.
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 animate-pulse pt-4 border-t border-white/5">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Waiting for transaction...
                            </div>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-8 space-y-6 text-center"
                        >
                            <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-4 ring-4 ring-green-500/20">
                                <ShieldCheck className="h-12 w-12 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold font-heading text-white">You're In!</h2>
                                <p className="text-zinc-400 max-w-[260px] mx-auto">
                                    Payment confirmed. Your secret key has unlocked the content.
                                </p>
                            </div>
                            <Button onClick={onClose} className="w-full" variant="glow" size="lg">
                                View Content <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
