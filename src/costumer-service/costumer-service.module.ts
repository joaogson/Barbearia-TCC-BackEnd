import { Module } from "@nestjs/common";
import { CostumerServiceService } from "./costumer-service.service";
import { CostumerServiceController } from "./costumer-service.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CostumerServiceController],
  providers: [CostumerServiceService],
})
export class CostumerServiceModule {}
