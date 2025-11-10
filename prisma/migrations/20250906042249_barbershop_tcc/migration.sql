-- CreateTable
CREATE TABLE `feedBack` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `idClient` INTEGER NOT NULL,
    `idBarber` INTEGER NOT NULL,

    UNIQUE INDEX `feedBack_idClient_key`(`idClient`),
    UNIQUE INDEX `feedBack_idBarber_key`(`idBarber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feedBack` ADD CONSTRAINT `feedBack_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedBack` ADD CONSTRAINT `feedBack_idBarber_fkey` FOREIGN KEY (`idBarber`) REFERENCES `barber`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
