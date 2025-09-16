import { IsInt, IsNotEmpty, IsPositive, IsString, Max, Min } from "class-validator";

export class CreateFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsInt()
  @IsPositive()
  clientId: number;

  @IsInt()
  @IsPositive()
  barberId: number;
}
