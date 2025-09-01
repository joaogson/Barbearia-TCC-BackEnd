/* eslint-disable @typescript-eslint/no-unsafe-call */

import { PlanResponseDto } from "src/plan/dto/plan-response.dto";

export class ClientResponseDto {
  id: number;
  name: string;
  email: string;
  phone: number;
  username: string;
  plan: PlanResponseDto | null;
}
