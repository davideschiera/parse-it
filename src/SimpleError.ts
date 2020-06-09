export class SimpleError extends Error {
    details?: string;
    nestedError?: any;

    constructor(message: string, details?: string, nestedError?: any) {
        super(message);

        this.details = details;
        this.nestedError = nestedError;
    }
}
