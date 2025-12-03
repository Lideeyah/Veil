import { ShieldedTransaction } from '@veil/types';
import { mockChain } from './mockTransactions';

export class MockTransactionMonitor {
    private pollingInterval: NodeJS.Timeout | null = null;
    private seenTxHashes: Set<string> = new Set();

    startMonitoring(
        address: string,
        viewingKey: string,
        callback: (tx: ShieldedTransaction) => void,
        intervalMs: number = 2000 // Faster polling for mock
    ): void {
        if (this.pollingInterval) {
            return;
        }

        console.log(`[MockMonitor] Started monitoring ${address}`);

        this.pollingInterval = setInterval(() => {
            const transactions = mockChain.getTransactionsForAddress(address);

            for (const tx of transactions) {
                if (this.seenTxHashes.has(tx.txHash)) {
                    // Update confirmations if changed?
                    // For now, just callback on new
                    continue;
                }

                // Only notify if confirmed (simulating real monitor waiting for 1 conf)
                if (tx.confirmations > 0) {
                    console.log(`[MockMonitor] New transaction detected: ${tx.txHash}`);
                    this.seenTxHashes.add(tx.txHash);
                    callback(tx);
                }
            }
        }, intervalMs);
    }

    stopMonitoring(): void {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
}
