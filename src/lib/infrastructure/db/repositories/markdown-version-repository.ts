import { markdowndocversion } from "@infrastructure/db/schema/markdown-doc-version";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq } from 'drizzle-orm';
import type { MarkdownDocVersionRepository } from "@ports/markdown-version-repository";
import type { NewMarkdownDocVersion } from "@entities/markdown-version-entity";

export function createMarkdownDocVersionRepository(db: LibSQLDatabase): MarkdownDocVersionRepository {
    return {
        async create(data: NewMarkdownDocVersion) {
            const [newVersion] = await db.insert(markdowndocversion).values(data).returning();
            return newVersion;
        },
        async findById(id) {
            const results = await db.select().from(markdowndocversion).where(eq(markdowndocversion.id, id));
            return results[0] ?? null;
        },
        async listByMarkdownDoc(markdownDocId) {
            const results = await db.select().from(markdowndocversion).where(eq(markdowndocversion.markdown_doc_id, markdownDocId));
            return results;
        },
    };
}
