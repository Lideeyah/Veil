export class ZcashError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ZcashError';
    }
}

export class ZcashConnectionError extends ZcashError {
    constructor(message: string = 'Failed to connect to Zcash node') {
        super(message);
        this.name = 'ZcashConnectionError';
    }
}

export class InvalidAddressError extends ZcashError {
    constructor(address: string) {
        super(`Invalid Zcash address: ${address}`);
        this.name = 'InvalidAddressError';
    }
}

export class MemoDecodingError extends ZcashError {
    constructor(message: string) {
        super(`Failed to decode memo: ${message}`);
        this.name = 'MemoDecodingError';
    }
}

export class TransactionNotFoundError extends ZcashError {
    constructor(txHash: string) {
        super(`Transaction not found: ${txHash}`);
        this.name = 'TransactionNotFoundError';
    }
}

export class InsufficientFundsError extends ZcashError {
    constructor() {
        super('Insufficient funds for transaction');
        this.name = 'InsufficientFundsError';
    }
}
