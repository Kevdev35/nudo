PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_client` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`contact_info` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_client`("id", "user_id", "name", "contact_info", "notes", "created_at", "updated_at", "deleted_at") SELECT "id", "user_id", "name", "contact_info", "notes", "created_at", "updated_at", "deleted_at" FROM `client`;--> statement-breakpoint
DROP TABLE `client`;--> statement-breakpoint
ALTER TABLE `__new_client` RENAME TO `client`;--> statement-breakpoint
PRAGMA foreign_keys=ON;