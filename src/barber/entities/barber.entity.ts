import { CostumerService } from "src/costumer-service/entities/costumer-service.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";
import { User } from "src/user/entities/user.entity";
import { inactivePeriods } from "./inactive-periods";

export class Barber {
  id: number;
  idUser: number;
  user: User;
  workStartTime: String;
  workEndTime: String;

  inactivePeriods: inactivePeriods;

  constumerService: CostumerService[];
  feedbacks: Feedback[];
}

//  id Int @id @default(autoincrement())
//   userId Int @unique
//   user User @relation(fields: [userId], references: [id])

//   workStartTime String @default("08:00")
//   workEndTime String @default("19:00")

//   inactivePeriods InactivePeriod[]

//   costumerService CostumerService[]
//   feedBack FeedBack[]
