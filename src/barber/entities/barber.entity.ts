import { Feedback } from "src/feedback/entities/feedback.entity";

export class Barber {
  id: number;
  name: string;
  email: string;
  phone: number;
  username: string;
  password: string;

  feedBack?: Feedback | null;
}
