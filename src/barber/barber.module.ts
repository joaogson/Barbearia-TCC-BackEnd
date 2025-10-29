import { Module } from "@nestjs/common";
import { BarberService } from "./barber.service";
import { BarberController } from "./barber.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [BarberController],
  providers: [BarberService, UserService],
})
export class BarberModule {}
