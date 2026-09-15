import { type MarkdownDoc, type NewMarkdownDoc } from "@entities/markdown-doc-entity";

export interface MarkdownDocRepository {
    create(data: NewMarkdownDoc): Promise<MarkdownDoc>;
    findById(id: MarkdownDoc['id']): Promise<MarkdownDoc | null>;
    listByProject(projectId: MarkdownDoc['project_id']): Promise<MarkdownDoc[]>
    update(id: MarkdownDoc['id'], data: Partial<Pick<NewMarkdownDoc, 'title' | 'current_content' >>): Promise<MarkdownDoc>
    softDelete(id: MarkdownDoc['id']): Promise<MarkdownDoc>
}