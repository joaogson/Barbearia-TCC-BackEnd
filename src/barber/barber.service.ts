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

  async getBarber(id: number) {
    try {
      const barber = await this.prisma.barber.findUnique({
        where: { id: id },
      });

      if (!barber) {
        throw new NotFoundException("Barbeiro não encontrado");
      }

      return barber;
    } catch (error) {
      throw new HttpException("Erro ao buscar o barbeiro", HttpStatus.BAD_REQUEST);
}
  }

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
      const data = Role.BARBER;

      this.userService.updateUserRole(userId, data);

      return newBarber;
    } catch (error) {
      throw new HttpException("Não foi possivel criar o barbeiro", HttpStatus.BAD_REQUEST);
    }
  }
}
