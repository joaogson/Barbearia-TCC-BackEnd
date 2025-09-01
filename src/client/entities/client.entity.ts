import { plan } from "generated/prisma";

export class Client {
  id: number;
  name: string;
  email: string;
  phone: number;
  username: string;
  password: string;

  // plan | null por ser opcional
  plan?: plan | null;
}
