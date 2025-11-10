/*
  Warnings:

  - A unique constraint covering the columns `[ServiceTime]` on the table `CostumerService` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CostumerService_ServiceTime_key` ON `CostumerService`(`ServiceTime`);

