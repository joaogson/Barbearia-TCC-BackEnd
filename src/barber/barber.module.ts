import { Module } from "@nestjs/common";
import { BarberService } from "./barber.service";
import { BarberController } from "./barber.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [BarberController],
  providers: [BarberService],
})
export class BarberModule {}
