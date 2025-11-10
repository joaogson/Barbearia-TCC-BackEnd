-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedBack_idBarber_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedBack_idClient_fkey`;

-- AddForeignKey
ALTER TABLE `feedBack` ADD CONSTRAINT `feedBack_idClient_fkey` FOREIGN KEY (`idClient`) REFERENCES `client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedBack` ADD CONSTRAINT `feedBack_idBarber_fkey` FOREIGN KEY (`idBarber`) REFERENCES `barber`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
