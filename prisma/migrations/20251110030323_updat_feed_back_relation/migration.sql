/*
  Warnings:

  - A unique constraint covering the columns `[clientId,barberId]` on the table `FeedBack` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `FeedBack_barberId_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `FeedBack_clientId_fkey`;

-- AlterTable
ALTER TABLE `feedback` MODIFY `comment` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `FeedBack_clientId_barberId_key` ON `FeedBack`(`clientId`, `barberId`);

-- AddForeignKey
ALTER TABLE `FeedBack` ADD CONSTRAINT `FeedBack_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedBack` ADD CONSTRAINT `FeedBack_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `Barber`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
