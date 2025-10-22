import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { RolesGuard } from "src/auth/guards/role.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Role } from "generated/prisma/client";

@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.feedbackService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(+id, updateFeedbackDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.feedbackService.remove(+id);
  }
}
