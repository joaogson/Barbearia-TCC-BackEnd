import { Module } from "@nestjs/common";
import { BarberService } from "./barber.service";
import { BarberController } from "./barber.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { UserService } from "src/user/user.service";

@Module({
  imports: [PrismaModule],
  controllers: [BarberController],
  providers: [BarberService, UserService],
})
export class BarberModule {}
