/*
  Warnings:

  - You are about to drop the column `idService` on the `costumerservice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `costumerservice` DROP FOREIGN KEY `CostumerService_idService_fkey`;

-- DropIndex
DROP INDEX `CostumerService_idService_fkey` ON `costumerservice`;

-- AlterTable
ALTER TABLE `costumerservice` DROP COLUMN `idService`;

-- CreateTable
CREATE TABLE `ServiceOnCostumerService` (
    `costumerServiceId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,

    PRIMARY KEY (`costumerServiceId`, `serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServiceOnCostumerService` ADD CONSTRAINT `ServiceOnCostumerService_costumerServiceId_fkey` FOREIGN KEY (`costumerServiceId`) REFERENCES `CostumerService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOnCostumerService` ADD CONSTRAINT `ServiceOnCostumerService_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
