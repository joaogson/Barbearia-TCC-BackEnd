import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BarberService {
  constructor(private prisma: PrismaService) {}

  /**
   * Atualiza o perfil de um barbeiro, baseado no ID do *usuário*
   */
  /**
   * Busca o perfil do barbeiro pelo ID do usuário
   */
  async getProfile(userId: number) {
    const profile = await this.prisma.barber.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException("Barbeiro não encontrado");
    }
    return profile;
  }
}
