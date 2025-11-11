import { Plan } from "generated/prisma/client";
import { Feedback } from "src/feedback/entities/feedback.entity";

export class Client {
  id: number;
  name: string;
  email: string;
  phone: number;
  username: string;
  password: string;

  // plan | null por ser opcional
  plan?: Plan | null;

  // feedBack | null por ser opcional
  feedBack?: Feedback | null;
}
