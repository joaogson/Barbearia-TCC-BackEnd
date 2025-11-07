-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `Client_planId_fkey`;

-- AlterTable
ALTER TABLE `client` MODIFY `planId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
