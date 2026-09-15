CREATE TABLE `kanbanboard` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `kanbanlist` (
	`id` text PRIMARY KEY NOT NULL,
	`kanban_board_id` text NOT NULL,
	`name` text NOT NULL,
	`order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`kanban_board_id`) REFERENCES `kanbanboard`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `kanbancard` (
	`id` text PRIMARY KEY NOT NULL,
	`kanban_list_id` text NOT NULL,
	`title` text DEFAULT 'Sin titulo' NOT NULL,
	`description` text,
	`order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`kanban_list_id`) REFERENCES `kanbanlist`(`id`) ON UPDATE no action ON DELETE no action
);
