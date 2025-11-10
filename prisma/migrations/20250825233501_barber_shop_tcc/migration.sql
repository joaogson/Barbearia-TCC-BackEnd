-- CreateTable
CREATE TABLE `plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DECIMAL(65, 30) NOT NULL,
    `haircutNumber` INTEGER NOT NULL,
    `idClient` INTEGER NOT NULL,

    UNIQUE INDEX `plan_idClient_key`(`idClient`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `plan` ADD CONSTRAINT `plan_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
