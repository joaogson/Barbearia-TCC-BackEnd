import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Barber } from "src/barber/entities/barber.entity";
import { BarberController } from "src/barber/barber.controller";
import { ClientController } from "src/client/client.controller";
import { BarberModule } from "src/barber/barber.module";
import { ClientModule } from "src/client/client.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { PlanModule } from "src/plan/plan.module";

@Module({
  imports: [BarberModule, ClientModule, PrismaModule, PlanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
