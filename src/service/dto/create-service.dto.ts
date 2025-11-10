import { IsString } from "class-validator";

export class CreateServiceDto {
  @IsString()
  description: string;
  duration: number;
}
