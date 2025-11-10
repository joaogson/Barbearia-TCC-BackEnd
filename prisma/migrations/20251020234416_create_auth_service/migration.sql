/*
  Warnings:

  - You are about to drop the column `email` on the `barber` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `barber` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `barber` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `barber` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `barber` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `barber` DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `phone`,
    DROP COLUMN `username`;

-- AlterTable
ALTER TABLE `client` DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `phone`,
    DROP COLUMN `username`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `role` ENUM('CLIENT', 'BARBER') NOT NULL DEFAULT 'CLIENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
