export interface MarkdownDocVersion {
    id: string,
    markdown_doc_id: string,
    content: string,
    version_number: number,
    createdAt: Date,
}

export type NewMarkdownDocVersion = Omit<MarkdownDocVersion, 'id' | 'createdAt'>