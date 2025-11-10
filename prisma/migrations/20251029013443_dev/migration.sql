/*
  Warnings:

  - You are about to drop the column `idBarber` on the `feedback` table. All the data in the column will be lost.
  - You are about to drop the column `idClient` on the `feedback` table. All the data in the column will be lost.
  - You are about to drop the column `idClient` on the `plan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clientId]` on the table `FeedBack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barberId]` on the table `FeedBack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barberId` to the `FeedBack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `FeedBack` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `FeedBack_idBarber_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `FeedBack_idClient_fkey`;

-- DropForeignKey
ALTER TABLE `plan` DROP FOREIGN KEY `Plan_idClient_fkey`;

-- DropIndex
DROP INDEX `feedBack_idBarber_key` ON `feedback`;

-- DropIndex
DROP INDEX `feedBack_idClient_key` ON `feedback`;

-- DropIndex
DROP INDEX `plan_idClient_key` ON `plan`;

-- AlterTable
ALTER TABLE `feedback` DROP COLUMN `idBarber`,
    DROP COLUMN `idClient`,
    ADD COLUMN `barberId` INTEGER NOT NULL,
    ADD COLUMN `clientId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `plan` DROP COLUMN `idClient`,
    ADD COLUMN `clientId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `FeedBack_clientId_key` ON `FeedBack`(`clientId`);

-- CreateIndex
CREATE UNIQUE INDEX `FeedBack_barberId_key` ON `FeedBack`(`barberId`);

-- CreateIndex
CREATE UNIQUE INDEX `Plan_clientId_key` ON `Plan`(`clientId`);

-- AddForeignKey
ALTER TABLE `Plan` ADD CONSTRAINT `Plan_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedBack` ADD CONSTRAINT `FeedBack_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedBack` ADD CONSTRAINT `FeedBack_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `Barber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

