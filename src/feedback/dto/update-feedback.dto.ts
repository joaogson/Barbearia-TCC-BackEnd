import { PartialType } from "@nestjs/mapped-types";
import { CreateFeedbackDto } from "./create-feedback.dto";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
