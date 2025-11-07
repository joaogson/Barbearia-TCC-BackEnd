/*
  Warnings:

  - You are about to drop the column `clientId` on the `plan` table. All the data in the column will be lost.
  - Added the required column `planId` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `plan` DROP FOREIGN KEY `Plan_clientId_fkey`;

-- DropIndex
DROP INDEX `Plan_clientId_key` ON `plan`;

-- AlterTable
ALTER TABLE `client` ADD COLUMN `planId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `plan` DROP COLUMN `clientId`;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
