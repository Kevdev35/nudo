import { type Client, type NewClient } from '@entities/client_entity';

export interface ClientRepository {
  create(data: NewClient): Promise<Client>;
  findById(id: Client['id']): Promise<Client | null>;
  listByUser(userId: Client['user_id']): Promise<Client[]>;
  update(id: Client['id'], data: Partial<Pick<NewClient, 'name' | 'contact_info' | 'notes'>>): Promise<Client>;
  softDelete(id: Client['id']): Promise<Client>
}