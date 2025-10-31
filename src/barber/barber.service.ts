import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBarberDto } from "./dto/create-barber.dto";
import { UserService } from "src/user/user.service";
import { Role } from "generated/prisma";
import { updateSettingsDto } from "./dto/update-barber.dto";
import { CreateInactivePeriodDto } from "./dto/create-inactive-period.dto";
import { Console } from "console";

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

  async getSettings(userId: number) {
    const barber = this.prisma.barber.findUnique({
      where: {
        id: userId,
      },
      select: {
        workStartTime: true,
        workEndTime: true,
      },
    });
    return barber;
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

  async updateSettings(userId: number, updateSettingsDto: updateSettingsDto) {
    try {
      const barber = await this.prisma.barber.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!barber) throw new HttpException("Não foi possivel localizar o barbeiro", HttpStatus.NOT_FOUND);
      console.log(barber.id);
      console.log("update: ", updateSettingsDto);
      return await this.prisma.barber.update({
        where: {
          id: barber.id,
        },
        data: {
          workStartTime: updateSettingsDto.workStartTime,
          workEndTime: updateSettingsDto.workEndTime,
          breakBetweenCostumerService: updateSettingsDto.breakBetweenCostumerService,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException("Não foi possivel atualizar as configurações do barbeiro", HttpStatus.BAD_REQUEST);
    }
  }

  async createInactivePeriods(userId: number, createInactivePeriodDto: CreateInactivePeriodDto) {
    try {
      const barber = await this.prisma.barber.findUnique({ where: { userId } });
      if (!barber) throw new HttpException("Não foi possivel localizar o barbeiro", HttpStatus.NOT_FOUND);

      if (createInactivePeriodDto.startTime > createInactivePeriodDto.endTime)
        throw new HttpException("O horario de inicio deve ser maior que o de final!", HttpStatus.BAD_REQUEST);
      return this.prisma.inactivePeriod.create({
        data: {
          date: new Date(createInactivePeriodDto.date),
          startTime: createInactivePeriodDto.startTime,
          endTime: createInactivePeriodDto.endTime,
          barber: {
            connect: { id: barber.id },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException("Não foi possivel criar o Periodo de inavitidade!", HttpStatus.BAD_REQUEST);
    }
  }

  async getInactivePeriodsByDate(userId: number, date: string) {
    try {
      const barber = await this.prisma.barber.findUnique({ where: { userId } });
      if (!barber) throw new NotFoundException("Barbeiro não encontrado.");
      console.log("GetBarbeiro: ", barber);
      // Lógica para buscar os períodos apenas para o dia especificado
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);

      console.log("Start Date", startDate);
      console.log("End Date", endDate);
      return this.prisma.inactivePeriod.findMany({
        where: {
          barbedId: barber.id,
          date: {
            gte: startDate, // gte = Greater Than or Equal (maior ou igual a)
            lte: endDate, // lte = Less Than or Equal (menor ou igual a)
          },
        },
      });
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelos periodos de inatividade", HttpStatus.BAD_REQUEST);
    }
  }

  async deleteInactivePeriods(id: number, userId: number) {
    try {
      const barber = await this.prisma.barber.findUnique({ where: { userId: userId } });

      if (!barber) throw new NotFoundException("Barbeiro não encontrado.");
      // Verificação de segurança: garante que o barbeiro só pode deletar seus próprios períodos
      const period = await this.prisma.inactivePeriod.findFirst({
        where: { id: id, barbedId: barber.id },
      });

      if (!period) {
        throw new HttpException("Não foi possivel localizar o periodo", HttpStatus.NOT_FOUND);
      }

      return this.prisma.inactivePeriod.delete({ where: { id: id } });
    } catch (error) {
      throw new HttpException("Não foi possivel deletar o periodo de inatividade", HttpStatus.BAD_REQUEST);
    }
  }
}
