import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "src/user/user.module";
import { ClientModule } from "src/client/client.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { PlanModule } from "src/plan/plan.module";
import { FeedbackModule } from "src/feedback/feedback.module";
import { CostumerServiceModule } from "src/costumer-service/costumer-service.module";
import { Module, MiddlewareConsumer, RequestMethod, Injectable, NestMiddleware } from "@nestjs/common";
import { ServiceModule } from "src/service/service.module";
import { BarberModule } from "src/barber/barber.module";
import { AuthModule } from "src/auth/auth.module";
import { MailerModule } from "@nestjs-modules/mailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

import { hostname } from "os";
import { NextFunction } from "express";

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
      transport: nodemailerSendgrid({
        apiKey: process.env.SMTP_PASS,
      }),
      defaults: {
        from: '"Barbearia TCC" <joaogsonalio@gmail.com>',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
