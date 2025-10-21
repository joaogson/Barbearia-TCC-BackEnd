/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `barber` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `barber` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `barber` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `client` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `barber_userId_key` ON `barber`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `client_userId_key` ON `client`(`userId`);

-- AddForeignKey
ALTER TABLE `barber` ADD CONSTRAINT `barber_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client` ADD CONSTRAINT `client_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
