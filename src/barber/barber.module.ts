import { Module } from "@nestjs/common";
import { BarberService } from "./barber.service";
import { BarberController } from "./barber.controller";
import { AppController } from "src/app/app.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [BarberController],
  providers: [BarberService],
})
export class BarberModule {}
