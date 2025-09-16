import { Module } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { FeedbackController } from "./feedback.controller";
import { BarberFeedbackController } from "./barberFeedback.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { ClientFeedbackController } from "./clientFeedback.controller";

@Module({
  imports: [PrismaModule],
  controllers: [FeedbackController, BarberFeedbackController, ClientFeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
