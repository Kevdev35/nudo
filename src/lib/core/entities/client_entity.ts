export interface Client {
    id: string,
    user_id: string,
    name: string,
    contact_info: string | null,
    notes: string | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
}

export type NewClient = Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;