import { type User, type NewUser } from '@entities/user-entity';

export interface UserRepository {
    create(data: NewUser): Promise<User>;
    findById(id: User['id']): Promise<User | null>;
    findByEmail(email: User['email']): Promise<User | null>;
    update(id: User['id'], data: Partial<Pick<NewUser, 'name' | 'password_hash'>>): Promise<User>;
    softDelete(id: User['id']): Promise<User>;
}