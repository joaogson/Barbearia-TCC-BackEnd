/*
  Warnings:

  - You are about to drop the column `isPaid` on the `costumerservice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `costumerservice` DROP COLUMN `isPaid`,
    ADD COLUMN `isCancelled` BOOLEAN NOT NULL DEFAULT false;
