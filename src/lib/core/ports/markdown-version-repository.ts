import { type MarkdownDocVersion, type NewMarkdownDocVersion } from "@entities/markdown-version-entity"

export interface MarkdownDocVersionRepository {
    create(data: NewMarkdownDocVersion): Promise<MarkdownDocVersion>;
    findById(id: MarkdownDocVersion["id"]): Promise<MarkdownDocVersion | null>;
    listByMarkdownDoc(markdownDocId: MarkdownDocVersion['markdown_doc_id']): Promise<MarkdownDocVersion[]>  
}