import { Barber } from "src/user/entities/barber.entity";
import { Client } from "src/client/entities/client.entity";
import { Service } from "src/service/entities/service.entity";

export class CostumerService {
  id: number;
  ServiceTime: Date;
  isPaid: Boolean;
  clientId: number;
  client: Client;
  barberId: number;
  barber: Barber;
  Services: Service[];
}
