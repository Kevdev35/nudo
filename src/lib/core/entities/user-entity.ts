export interface User {
    id: string,
    name: string | null,
    email: string ,
    password_hash: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;