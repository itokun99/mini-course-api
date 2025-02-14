CREATE TABLE `roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`value` text,
	`created_at` text,
	`updated_at` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_value_unique` ON `roles` (`value`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text,
	`updated_at` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_courses`("id", "name", "description", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "description", "created_at", "updated_at", "deleted_at" FROM `courses`;--> statement-breakpoint
DROP TABLE `courses`;--> statement-breakpoint
ALTER TABLE `__new_courses` RENAME TO `courses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_lessons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`course_id` integer NOT NULL,
	`created_at` text,
	`updated_at` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_lessons`("id", "name", "description", "course_id", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "description", "course_id", "created_at", "updated_at", "deleted_at" FROM `lessons`;--> statement-breakpoint
DROP TABLE `lessons`;--> statement-breakpoint
ALTER TABLE `__new_lessons` RENAME TO `lessons`;--> statement-breakpoint
CREATE TABLE `__new_user_courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`course_id` integer NOT NULL,
	`created_at` text,
	`updated_at` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_user_courses`("id", "user_id", "course_id", "created_at", "updated_at", "deleted_at") SELECT "id", "user_id", "course_id", "created_at", "updated_at", "deleted_at" FROM `user_courses`;--> statement-breakpoint
DROP TABLE `user_courses`;--> statement-breakpoint
ALTER TABLE `__new_user_courses` RENAME TO `user_courses`;--> statement-breakpoint
CREATE TABLE `__new_user_credentials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text,
	`forget_token` text,
	`user_id` integer NOT NULL,
	`created_at` text,
	`updated_at` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_user_credentials`("id", "token", "forget_token", "user_id", "created_at", "updated_at", "deleted_at") SELECT "id", "token", "forget_token", "user_id", "created_at", "updated_at", "deleted_at" FROM `user_credentials`;--> statement-breakpoint
DROP TABLE `user_credentials`;--> statement-breakpoint
ALTER TABLE `__new_user_credentials` RENAME TO `user_credentials`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`role_id` integer NOT NULL,
	`created_at` text,
	`updated_at` text,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "username", "password", "role_id", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "email", "username", "password", "role_id", "created_at", "updated_at", "deleted_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);