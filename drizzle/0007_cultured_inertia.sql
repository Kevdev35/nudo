CREATE TABLE `markdowndocversion` (
	`id` text PRIMARY KEY NOT NULL,
	`markdown_doc_id` text NOT NULL,
	`content` text NOT NULL,
	`version_number` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`markdown_doc_id`) REFERENCES `markdowndoc`(`id`) ON UPDATE no action ON DELETE no action
);
