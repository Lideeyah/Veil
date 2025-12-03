import { ZCASH_CONFIG } from './config';
import { ZcashConnectionError, TransactionNotFoundError } from './error';

export class ZcashRPCClient {
    private url: string;
    private auth: string;

    constructor() {
        const { host, port, username, password } = ZCASH_CONFIG.rpc;
        this.url = `http://${host}:${port}`;
        this.auth = Buffer.from(`${username}:${password}`).toString('base64');
    }

    async call<T>(method: string, params: any[] = []): Promise<T> {
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${this.auth}`,
                },
                body: JSON.stringify({
                    jsonrpc: '1.0',
                    id: 'veil-rpc',
                    method,
                    params,
                }),
            });

            if (!response.ok) {
                throw new ZcashConnectionError(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            return data.result as T;
        } catch (error) {
            if (error instanceof Error) {
                throw new ZcashConnectionError(error.message);
            }
            throw new ZcashConnectionError('Unknown error occurred');
        }
    }

    async getBlockchainInfo(): Promise<any> {
        return this.call('getblockchaininfo');
    }

    async getNewAddress(): Promise<string> {
        return this.call('z_getnewaddress');
    }

    async listShieldedTransactions(address: string): Promise<any[]> {
        // Note: z_listreceivedbyaddress is the standard call for shielded
        return this.call('z_listreceivedbyaddress', [address]);
    }

    async getTransaction(txHash: string): Promise<any> {
        try {
            return await this.call('gettransaction', [txHash]);
        } catch (error) {
            throw new TransactionNotFoundError(txHash);
        }
    }
}
