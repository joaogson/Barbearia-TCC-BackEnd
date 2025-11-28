import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCostumerServiceDto } from "./dto/create-costumer-service.dto";
import { UpdateCostumerServiceDto } from "./dto/update-costumer-service.dto";
import { Role } from "generated/prisma/client";
import dayjs from "dayjs";

@Injectable()
export class CostumerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCostumerServiceDto: CreateCostumerServiceDto) {
    try {
      if (!createCostumerServiceDto) {
        throw new HttpException("Serviço vazio!", HttpStatus.BAD_REQUEST);
      }
      console.log(createCostumerServiceDto);

      const services = await this.prisma.service.findMany({
        where: {
          id: { in: createCostumerServiceDto.servicesIds },
        },
        select: { duration: true },
      });

      if (services.length !== createCostumerServiceDto.servicesIds.length) {
        throw new HttpException("Um ou mais IDs de serviço são inválidos.", HttpStatus.BAD_REQUEST);
      }
      const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);

      const newServiceStart = dayjs(createCostumerServiceDto.ServiceTime);

      const newServiceStartUTC = newServiceStart.toDate();

      const newServiceEndUTC = newServiceStart.add(totalDuration, "minute").toDate();

      const barber = await this.prisma.barber.findUnique({
        where: { id: createCostumerServiceDto.barberId },
        select: { breakBetweenCostumerService: true },
      });

      if (!barber) throw new HttpException("Barbeiro não encontrado", HttpStatus.NOT_FOUND);

      const newServiceEndWithBreakUTC = newServiceStart.add(totalDuration + barber.breakBetweenCostumerService, "minute").toDate();

      const conflictingCostumerServices = await this.prisma.costumerService.findMany({
        where: {
          barberId: createCostumerServiceDto.barberId,
          isCancelled: false,
          AND: [
            {
              ServiceTime: {
                gte: dayjs(newServiceStart).startOf("day").toDate(),
                lte: dayjs(newServiceStart).endOf("day").toDate(),
              },
            },
          ],
        },
      });

      const hasConflict = conflictingCostumerServices.some((existingAppt) => {
        const existingStart = dayjs(existingAppt.ServiceTime);
        const existingEnd = existingStart.add(existingAppt.totalDuration + barber.breakBetweenCostumerService, "minute");

        return newServiceStart.isBefore(existingEnd) && dayjs(newServiceEndWithBreakUTC).isAfter(existingStart);
      });

      if (hasConflict) {
        throw new HttpException("Este horário conflita com um agendamento existente!", HttpStatus.CONFLICT);
      }

      const newService = await this.prisma.costumerService.create({
        data: {
          ServiceTime: newServiceStartUTC,
          isCancelled: createCostumerServiceDto.isCancelled,
          clientId: createCostumerServiceDto.clientId,
          barberId: createCostumerServiceDto.barberId,
          totalDuration: totalDuration,
          Services: {
            create: createCostumerServiceDto.servicesIds.map((serviceId) => ({
              service: {
                connect: { id: serviceId },
              },
            })),
          },
        },
        include: {
          Services: true,
        },
      });
      console.log(`Serviço Criado ${newService.ServiceTime}`);
      return newService;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error("Erro detalhado: ", error);
      throw new HttpException("Não foi possível registrar o serviço.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const services = await this.prisma.costumerService.findMany({
        include: {
          client: true,
          barber: true,
          Services: true,
        },
      });
      return services;
    } catch (error) {
      throw new HttpException("Ocorreu um erro ao buscar os serviços.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    const service = await this.prisma.costumerService.findUnique({
      where: { id: id },
      include: {
        client: true,
        barber: true,
        Services: true,
      },
    });

    if (!service) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado.`);
    }

    return service;
  }

  async findById(id: number) {
    console.log("Buscando serviços para o usuário com ID:", id);
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    console.log("Usuário encontrado:", user);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    let whereClause = {};
    if (user.role === Role.CLIENT) {
      const client = await this.prisma.client.findUnique({ where: { userId: id } });
      console.log("Cliente encontrado:", client);
      if (client) {
        whereClause = { clientId: client.id };
      }
    } else if (user.role === Role.BARBER) {
      const barber = await this.prisma.barber.findUnique({ where: { userId: id } });
      console.log("Barbeiro encontrado:", barber);
      if (barber) {
        whereClause = { barberId: barber.id };
      }
    }

    const costumerServices = await this.prisma.costumerService.findMany({
      where: { ...whereClause, isCancelled: false },
      orderBy: {
        ServiceTime: "asc",
      },
      include: {
        client: {
          include: { user: true },
        },
        barber: {
          include: { user: true },
        },
        Services: {
          include: { service: true },
        },
      },
    });
    console.log("Serviços do usuário:", costumerServices);
    return costumerServices;
  }

  async update(id: number, updateCostumerServiceDto: UpdateCostumerServiceDto) {
    await this.findOne(id);

    try {
      const updatedService = await this.prisma.costumerService.update({
        where: { id },
        data: updateCostumerServiceDto,
      });

      return updatedService;
    } catch (error) {
      throw new HttpException("Não foi possível atualizar o serviço.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async cancelCostumerService(id: string) {
    const costumerService = await this.prisma.costumerService.update({
      where: { id: Number(id) },
      data: {
        isCancelled: true,
      },
    });
    return costumerService;
  }

  async remove(id: number) {
    const serviceToRemove = await this.findOne(id);

    try {
      await this.prisma.costumerService.delete({
        where: { id: serviceToRemove.id },
      });

      return { message: `Serviço com ID ${id} foi removido com sucesso.` };
    } catch (error) {
      throw new HttpException("Não foi possível remover o serviço.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
