export const ZCASH_CONFIG = {
    network: process.env.ZCASH_NETWORK || 'testnet',
    rpc: {
        host: process.env.ZCASH_RPC_HOST || 'localhost',
        port: parseInt(process.env.ZCASH_RPC_PORT || '18232', 10),
        username: process.env.ZCASH_RPC_USER || 'user',
        password: process.env.ZCASH_RPC_PASSWORD || 'password',
    },
    defaults: {
        minConfirmations: 1,
        fee: 10000, // 0.0001 ZEC in sats
    },
    memo: {
        maxSize: 512,
    },
};
