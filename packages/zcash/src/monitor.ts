import { ZcashRPCClient } from './rpc';
import { ShieldedTransaction } from '@veil/types';
import { decodeMemo } from './memo';

export class ZcashTransactionMonitor {
    private rpc: ZcashRPCClient;
    private pollingInterval: NodeJS.Timeout | null = null;
    private seenTxHashes: Set<string> = new Set();

    constructor() {
        this.rpc = new ZcashRPCClient();
    }

    startMonitoring(
        address: string,
        viewingKey: string,
        callback: (tx: ShieldedTransaction) => void,
        intervalMs: number = 10000
    ): void {
        if (this.pollingInterval) {
            return;
        }

        this.pollingInterval = setInterval(async () => {
            try {
                const transactions = await this.rpc.listShieldedTransactions(address);

                for (const tx of transactions) {
                    if (this.seenTxHashes.has(tx.txid)) {
                        continue;
                    }

                    // Process new transaction
                    const shieldedTx: ShieldedTransaction = {
                        txHash: tx.txid,
                        amount: BigInt(Math.round(tx.amount * 100_000_000)),
                        confirmations: tx.confirmations,
                        timestamp: Date.now(), // RPC might provide time
                        memo: tx.memo, // Hex encoded memo
                    };

                    this.seenTxHashes.add(tx.txid);
                    callback(shieldedTx);
                }
            } catch (error) {
                console.error('Error polling Zcash transactions:', error);
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
