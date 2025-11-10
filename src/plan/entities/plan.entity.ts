import { Client } from "src/client/entities/client.entity";

export class Plan {
  id: number;
  value: number;
  haircutNumber: number;
  clientId: number;
  client: Client
}
