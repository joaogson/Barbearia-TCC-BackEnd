import { CostumerService } from "src/costumer-service/entities/costumer-service.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";
import { User } from "src/user/entities/user.entity";

export class Barber {
  id: number;
  idUser: number;
  user: User;
  constumerService: CostumerService[];
  feedbacks: Feedback[];
}
