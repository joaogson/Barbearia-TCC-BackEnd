import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { PrismaService } from "src/prisma/prisma.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService
  ) {}

  @Get("/health") // <- O novo endpoint
  async healthCheck() {
    // Esta query força o banco a ficar acordado
    await this.prisma.$queryRaw`SELECT 1`;
    console.log("OK");
    return { status: "ok", time: new Date() };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
