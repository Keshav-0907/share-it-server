export interface User {
    name: string;
    email: string;
    password: string;
    subscription: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

export interface File {
    filename: string;
    url: string;
    metadata?: {
        size: number;
        mimetype: string;
    };
}

export interface FileGroup {
    name: string;
    files: string[];
    url: string;
    code: string;
    isProtected: boolean;
    password?: string;
    expiresAt: Date;
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}