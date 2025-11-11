import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";

export class CreateFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsInt()
  @IsPositive()
  barberId: number;
}
