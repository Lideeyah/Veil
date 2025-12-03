import { ShieldedTransaction, MemoData } from '@veil/types';
import { encodeMockMemo } from './mockMemo';
import { randomBytes } from 'crypto';

export interface MockTransaction extends ShieldedTransaction {
    toAddress: string;
    fromAddress?: string;
}

export class MockTransactionSimulator {
    private transactions: MockTransaction[] = [];
    private pendingTransactions: MockTransaction[] = [];

    constructor(private config: { confirmTimeMs: number } = { confirmTimeMs: 5000 }) { }

    async createTransaction(
        from: string,
        to: string,
        amount: bigint,
        memoData?: MemoData
    ): Promise<string> {
        const txHash = randomBytes(32).toString('hex');

        let encodedMemo: string | undefined;
        if (memoData) {
            const buffer = encodeMockMemo(memoData);
            encodedMemo = buffer.toString('hex'); // Store as hex in tx
        }

        const tx: MockTransaction = {
            txHash,
            toAddress: to,
            fromAddress: from,
            amount,
            memo: encodedMemo,
            timestamp: Date.now(),
            confirmations: 0,
        };

        this.pendingTransactions.push(tx);

        // Simulate mining
        setTimeout(() => {
            this.confirmTransaction(txHash);
        }, this.config.confirmTimeMs);

        return txHash;
    }

    private confirmTransaction(txHash: string) {
        const index = this.pendingTransactions.findIndex(t => t.txHash === txHash);
        if (index !== -1) {
            const tx = this.pendingTransactions[index];
            tx.confirmations = 1;
            this.transactions.push(tx);
            this.pendingTransactions.splice(index, 1);

            // Simulate more confirmations over time
            this.incrementConfirmations(txHash);
        }
    }

    private incrementConfirmations(txHash: string) {
        const interval = setInterval(() => {
            const tx = this.transactions.find(t => t.txHash === txHash);
            if (tx) {
                tx.confirmations += 1;
                if (tx.confirmations >= 6) {
                    clearInterval(interval);
                }
            } else {
                clearInterval(interval);
            }
        }, 2000);
    }

    getTransactionsForAddress(address: string): MockTransaction[] {
        return this.transactions.filter(t => t.toAddress === address);
    }

    getTransaction(txHash: string): MockTransaction | undefined {
        return this.transactions.find(t => t.txHash === txHash) ||
            this.pendingTransactions.find(t => t.txHash === txHash);
    }
}

// Singleton instance for the app
export const mockChain = new MockTransactionSimulator();
