import { IsNumber, IsString } from "class-validator";

export class CreateServiceDto {
  @IsString()
  description: string;
  @IsNumber()
  duration: number;
}
