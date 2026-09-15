export interface Session {
    id: string;
    user_id: string;
    createdAt: Date;
    expiresAt: Date;
}

export type NewSession = Omit<Session, 'createdAt'>