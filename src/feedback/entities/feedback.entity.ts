import { Barber } from "src/barber/entities/barber.entity";
import { Client } from "src/client/entities/client.entity";

export class Feedback {
  id: number;
  rating: number;
  comment: string;
  clientId: number;
  barberId: number;
  client: Client;
  barber: Barber;
}
