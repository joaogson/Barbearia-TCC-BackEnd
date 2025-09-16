-- CreateTable
CREATE TABLE `CostumerService` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idClient` INTEGER NOT NULL,
    `idBarber` INTEGER NOT NULL,
    `ServiceTime` DATETIME(3) NOT NULL,
    `isPaid` BOOLEAN NOT NULL,

    UNIQUE INDEX `CostumerService_idClient_key`(`idClient`),
    UNIQUE INDEX `CostumerService_idBarber_key`(`idBarber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CostumerService` ADD CONSTRAINT `CostumerService_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CostumerService` ADD CONSTRAINT `CostumerService_idBarber_fkey` FOREIGN KEY (`idBarber`) REFERENCES `barber`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
