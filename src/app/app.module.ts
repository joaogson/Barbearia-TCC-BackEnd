import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "src/user/user.module";
import { ClientModule } from "src/client/client.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { PlanModule } from "src/plan/plan.module";
import { FeedbackModule } from "src/feedback/feedback.module";
import { CostumerServiceModule } from "src/costumer-service/costumer-service.module";
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import * as cors from "cors"; // Importa o pacote
import { ServiceModule } from "src/service/service.module";
import { BarberModule } from "src/barber/barber.module";
import { AuthModule } from "src/auth/auth.module";
import { MailerModule } from "@nestjs-modules/mailer";

import { hostname } from "os";

@Module({
  imports: [
    AuthModule,
    BarberModule,
    UserModule,
    ClientModule,
    PrismaModule,
    PlanModule,
    FeedbackModule,
    CostumerServiceModule,
    ServiceModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST, // ex: 'smtp.sendgrid.net'
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: false,
        auth: {
          user: process.env.SMTP_USER, // Usuário (ex: 'apikey')
          pass: process.env.SMTP_PASS, // Senha (ex: sua API key do SendGrid)
        },
      },
      defaults: {
        from: '"Barbearia TCC" <joaogsonalio@gmail.com>',
      },
    }),
  ],
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
          origin: ["http://localhost:3001", "http://192.168.1.62:3001"], // Substitua pelo domínio do seu frontend
          methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
          credentials: true,
        })
      )
      // Aplica a todas as rotas (path: '*') e todos os métodos (RequestMethod.ALL)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
