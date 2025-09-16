import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BarberModule } from "src/barber/barber.module";
import { ClientModule } from "src/client/client.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { PlanModule } from "src/plan/plan.module";
import { FeedbackModule } from "src/feedback/feedback.module";
import { CostumerServiceModule } from "src/costumer-service/costumer-service.module";

@Module({
  imports: [BarberModule, ClientModule, PrismaModule, PlanModule, FeedbackModule, CostumerServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
