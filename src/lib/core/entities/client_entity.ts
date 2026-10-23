export interface Client {
    id: string,
    user_id: string,
    name: string,
    email: string | null,
    phone: string | null,
    location: string | null,
    notes: string | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
}

export type NewClient = Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;