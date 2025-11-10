import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateBarberDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
