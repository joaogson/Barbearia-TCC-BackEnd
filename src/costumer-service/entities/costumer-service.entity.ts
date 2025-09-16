import { Barber } from "src/barber/entities/barber.entity";
import { Client } from "src/client/entities/client.entity";

export class CostumerService {
  id: number;
  ServiceTime: Date;
  isPaid: Boolean;
  clientId: number;
  client: Client;
  barberId: number;
  barber: Barber;
}
