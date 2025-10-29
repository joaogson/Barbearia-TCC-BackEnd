/*
  Warnings:

  - Added the required column `totalDuration` to the `CostumerService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `barber` DROP FOREIGN KEY `barber_userId_fkey`;

-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `client_userId_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedBack_idBarber_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedBack_idClient_fkey`;

-- DropForeignKey
ALTER TABLE `plan` DROP FOREIGN KEY `plan_idClient_fkey`;

-- AlterTable
ALTER TABLE `barber` ADD COLUMN `workEndTime` VARCHAR(191) NOT NULL DEFAULT '19:00',
    ADD COLUMN `workStartTime` VARCHAR(191) NOT NULL DEFAULT '08:00';

-- AlterTable
ALTER TABLE `costumerservice` ADD COLUMN `totalDuration` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `duration` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `InactivePeriod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `barbedId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Barber` ADD CONSTRAINT `Barber_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactivePeriod` ADD CONSTRAINT `InactivePeriod_barbedId_fkey` FOREIGN KEY (`barbedId`) REFERENCES `Barber`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plan` ADD CONSTRAINT `Plan_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedBack` ADD CONSTRAINT `FeedBack_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedBack` ADD CONSTRAINT `FeedBack_idBarber_fkey` FOREIGN KEY (`idBarber`) REFERENCES `Barber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
