export interface MarkdownDoc {
    id: string,
    project_id: string,
    title: string,
    current_content: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
}


export type NewMarkdownDoc = Omit<MarkdownDoc, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>