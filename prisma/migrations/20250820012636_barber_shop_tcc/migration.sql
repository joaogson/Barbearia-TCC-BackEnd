/*
  Warnings:

  - You are about to alter the column `phone` on the `barber` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `phone` on the `client` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `barber` MODIFY `phone` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `client` MODIFY `phone` INTEGER NOT NULL;
