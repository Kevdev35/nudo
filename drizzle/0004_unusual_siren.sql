CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`clientId` text,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pendiente' NOT NULL,
	`budget` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`clientId`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action
);
