import { Module } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { PlanController } from "./plan.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { ClientPlanController } from "./clientPlan.controller";
@Module({
  imports: [PrismaModule],
  controllers: [PlanController, ClientPlanController],
  providers: [PlanService],
})
export class PlanModule {}
