import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BarberModule } from "src/barber/barber.module";
import { ClientModule } from "src/client/client.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { PlanModule } from "src/plan/plan.module";
import { FeedbackModule } from "src/feedback/feedback.module";
import { CostumerServiceModule } from "src/costumer-service/costumer-service.module";
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import * as cors from "cors"; // Importa o pacote
import { ServiceModule } from "src/service/service.module";

@Module({
  imports: [BarberModule, ClientModule, PrismaModule, PlanModule, FeedbackModule, CostumerServiceModule, ServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const cors = require("cors");
    // 🚨 Esta linha força o CORS a ser aplicado antes de qualquer rota
    consumer
      .apply(
        cors({
          origin: "http://localhost:3001",
          methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
          credentials: true,
        })
      )
      // Aplica a todas as rotas (path: '*') e todos os métodos (RequestMethod.ALL)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
