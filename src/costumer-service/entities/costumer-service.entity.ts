import { Barber } from "src/barber/entities/barber.entity";
import { Client } from "src/client/entities/client.entity";
import { Service } from "src/service/entities/service.entity";

export class CostumerService {
  id: number;
  ServiceTime: Date;
  isCancelled: Boolean;
  clientId: number;
  client: Client;
  barberId: number;
  barber: Barber;
  Services: Service[];
}
