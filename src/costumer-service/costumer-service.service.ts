import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCostumerServiceDto } from "./dto/create-costumer-service.dto";
import { UpdateCostumerServiceDto } from "./dto/update-costumer-service.dto";

@Injectable()
export class CostumerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo serviço de cliente no banco de dados.
   * @param createCostumerServiceDto - Dados para a criação do serviço.
   */
  async create(createCostumerServiceDto: CreateCostumerServiceDto) {
    try {
      const newService = await this.prisma.costumerService.create({
        data: {
          ServiceTime: createCostumerServiceDto.ServiceTime,
          isPaid: createCostumerServiceDto.isPaid,
          clientId: createCostumerServiceDto.clientId,
          barberId: createCostumerServiceDto.barberId,
          idService: createCostumerServiceDto.serviceId,
        },
      });
      return newService;
    } catch (error) {
      // Trata erros de chave estrangeira (ex: clientId ou barberId não existem)
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
        },
      });
      return services;
    } catch (error) {
      throw new HttpException("Ocorreu um erro ao buscar os serviços.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Encontra um serviço específico pelo ID.
   * @param id - O ID do serviço a ser encontrado.
   */
  async findOne(id: number) {
    const service = await this.prisma.costumerService.findUnique({
      where: { id },
      include: {
        client: true,
        barber: true,
      },
    });

    if (!service) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado.`);
    }

    return service;
  }

  /**
   * Atualiza os dados de um serviço de cliente.
   * @param id - O ID do serviço a ser atualizado.
   * @param updateCostumerServiceDto - Os novos dados para o serviço.
   */
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

  /**
   * Remove um serviço do banco de dados.
   * @param id - O ID do serviço a ser removido.
   */
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
