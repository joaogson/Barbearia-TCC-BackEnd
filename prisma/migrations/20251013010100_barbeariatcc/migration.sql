/*
  Warnings:

  - You are about to drop the column `idBarber` on the `costumerservice` table. All the data in the column will be lost.
  - You are about to drop the column `idClient` on the `costumerservice` table. All the data in the column will be lost.
  - Added the required column `barberId` to the `CostumerService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `CostumerService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idService` to the `CostumerService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `costumerservice` DROP FOREIGN KEY `CostumerService_idBarber_fkey`;

-- DropForeignKey
ALTER TABLE `costumerservice` DROP FOREIGN KEY `CostumerService_idClient_fkey`;

-- DropIndex
DROP INDEX `CostumerService_idBarber_key` ON `costumerservice`;

-- DropIndex
DROP INDEX `CostumerService_idClient_key` ON `costumerservice`;

-- AlterTable
ALTER TABLE `costumerservice` DROP COLUMN `idBarber`,
    DROP COLUMN `idClient`,
    ADD COLUMN `barberId` INTEGER NOT NULL,
    ADD COLUMN `clientId` INTEGER NOT NULL,
    ADD COLUMN `idService` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CostumerService` ADD CONSTRAINT `CostumerService_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CostumerService` ADD CONSTRAINT `CostumerService_barberId_fkey` FOREIGN KEY (`barberId`) REFERENCES `barber`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CostumerService` ADD CONSTRAINT `CostumerService_idService_fkey` FOREIGN KEY (`idService`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
