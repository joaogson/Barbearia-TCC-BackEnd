import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Barber } from "src/barber/entities/barber.entity";
import { BarberController } from "src/barber/barber.controller";
import { ClientController } from "src/client/client.controller";

@Module({
  imports: [],
  controllers: [AppController, BarberController, ClientController],
  providers: [AppService],
})
export class AppModule {}
