export interface AuthProvider {
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    createSession(userId: string): Promise<{token: string; expiresAt: Date}>;
    validateSession(token: string): Promise<{userId: string} | null>;
    invalidateSession(token: string): Promise<void>;
}