import { Module } from "@nestjs/common";
import { CostumerService } from "./costumer-service.service";
import { CostumerServiceController } from "./costumer-service.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { ClientService } from "src/client/client.service";
import { BarberService } from "src/barber/barber.service";

@Module({
  imports: [PrismaModule],
  controllers: [CostumerServiceController],
  providers: [CostumerService, ClientService, BarberService],
})
export class CostumerServiceModule {}
