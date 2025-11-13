import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from "@nestjs/common";
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

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createFeedbackDto: CreateFeedbackDto) {
    const userId = req.user.userId;
    console.log("client: ", req.user);
    console.log(createFeedbackDto);
    return this.feedbackService.create(createFeedbackDto, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMyFeedbacks(@Request() req) {
    const userId = req.user.userId;
    const role = req.user.role; // Pega o ID do usuário do token JWT
    return this.feedbackService.findFeedbacksByUser(userId, role);
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
  @Roles(Role.CLIENT)
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.feedbackService.remove(+id);
  }
}
