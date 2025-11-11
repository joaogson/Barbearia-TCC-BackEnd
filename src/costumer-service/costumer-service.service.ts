import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCostumerServiceDto } from "./dto/create-costumer-service.dto";
import { UpdateCostumerServiceDto } from "./dto/update-costumer-service.dto";
import { Role } from "generated/prisma/client";


@Injectable()
export class CostumerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo serviço de cliente no banco de dados.
   * @param createCostumerServiceDto - Dados para a criação do serviço.
   */
  async create(createCostumerServiceDto: CreateCostumerServiceDto) {
    try {
      if (!createCostumerServiceDto) {
        throw new HttpException("Serviço vazio!", HttpStatus.BAD_REQUEST);
      }
      console.log(createCostumerServiceDto);

      const costumerService = await this.prisma.costumerService.findFirst({
        where: {
          ServiceTime: createCostumerServiceDto.ServiceTime,
          barberId: createCostumerServiceDto.barberId,
        },
      });

      if (costumerService) throw new HttpException("Ja existe um atendimento agendado para esse horario com esse barbeiro!", HttpStatus.BAD_REQUEST);

      //Salva a soma das durações dos serviços

      const services = await this.prisma.service.findMany({
        where: {
          id: {
            in: createCostumerServiceDto.servicesIds,
          },
        },
        select: {
          duration: true,
        },
      });

      const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);

      const newService = await this.prisma.costumerService.create({
        data: {
          ServiceTime: createCostumerServiceDto.ServiceTime,
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
      // Trata erros de chave estrangeira (ex: clientId ou barberId não existem)
      console.error("Erro detalhado: ", error);
      throw new HttpException("Não foi possível registrar o serviço.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retorna todos os serviços cadastrados.
   */
  async findAll() {
    try {
      const services = await this.prisma.costumerService.findMany({
        include: {
          client: true, // Inclui os dados do cliente
          barber: true, // Inclui os dados do barbeiro
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
    await this.findOne(id); // Primeiro, verifica se o serviço existe

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
    const serviceToRemove = await this.findOne(id); // Verifica a existência antes de remover

    try {
      await this.prisma.costumerService.delete({
        where: { id },
      });

      return { message: `Serviço com ID ${id} foi removido com sucesso.` };
    } catch (error) {
      throw new HttpException("Não foi possível remover o serviço.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
