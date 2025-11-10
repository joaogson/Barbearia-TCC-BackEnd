import { Barber } from "./barber.entity";

export class inactivePeriods {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
  barberId: number;
  barber: Barber;
}

// id Int @id @default(autoincrement())
//   date DateTime
//   startTime String
//   endTime String
//   barbedId Int
//   barber Barber @relation(fields: [barbedId], references: [id])
