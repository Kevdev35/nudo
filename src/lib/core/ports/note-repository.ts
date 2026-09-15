import {type Note, type NewNote} from '@entities/note-entity';

export interface NoteRepository {
    create(data: NewNote): Promise<Note>
    findById(id: Note['id']): Promise<Note | null>
    listByProject(projectId: Note['project_id']): Promise<Note[]>
    update(id: Note['id'], data: Partial<Pick<NewNote, 'content' | 'order' | 'completed' | 'color'>>): Promise<Note>
    softDelete(id: Note['id']): Promise<Note>
}