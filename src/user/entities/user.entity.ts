import { Role } from "generated/prisma";
import { Feedback } from "src/feedback/entities/feedback.entity";

export class User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}
