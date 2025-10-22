import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBarberDto } from "./dto/create-barber.dto";
import { UserService } from "src/user/user.service";
import { Role } from "generated/prisma";

@Injectable()
export class BarberService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  /**
   * Busca o perfil do barbeiro pelo ID do usuário
   */
  async getProfile(userId: number) {
    const profile = await this.prisma.barber.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new HttpException("barbeiro não encontrado", HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  async create(createBarberDto: CreateBarberDto) {
    try {
      const newBarber = await this.prisma.barber.create({
        data: {
          userId: createBarberDto.userId,
        },
      });

      const userId = newBarber.userId;
      const data = {
        role: Role.BARBER,
      };

      this.userService.update(userId, data);

      return newBarber;
    } catch (error) {
      throw new HttpException("Não foi possivel criar o barbeiro", HttpStatus.BAD_REQUEST);
    }
  }
}
