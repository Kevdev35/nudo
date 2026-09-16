ALTER TABLE `note` ADD `color` text;--> statement-breakpoint
ALTER TABLE `note` ADD `completed` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `kanbancard` ADD `completed` integer DEFAULT 0 NOT NULL;