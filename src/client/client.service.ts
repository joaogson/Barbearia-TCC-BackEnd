import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateClientDto } from "./dto/update-client.dto";
import { promises } from "dns";
import { Prisma } from "generated/prisma";

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async updateClient(userId: number, updadateClientDto: UpdateClientDto) {
    try {
      const dataToUpdate: Prisma.clientUpdateInput = {};
      if (updadateClientDto.planId === null) {
        // Cenário: O usuário quer REMOVER o plano (enviou 'null')
        dataToUpdate.plan = {
          disconnect: true,
        };
      } else if (updadateClientDto.planId) {
        // Cenário: O usuário quer MUDAR ou ADICIONAR um plano (enviou um ID)
        dataToUpdate.plan = {
          connect: {
            id: updadateClientDto.planId, // Conecte ao plano com este ID
          },
        };
      }

      return await this.prisma.client.update({
        where: { userId: userId },
        data: dataToUpdate,
      });
    } catch (error) {
      throw new HttpException("Cliente não encontrado", HttpStatus.NOT_FOUND);
    }
  }

  async getClient(userId: number) {
    const client = await this.prisma.client.findUnique({
      where: { userId },
    });
    if (!client) {
      throw new HttpException("Cliente não encontrado", HttpStatus.NOT_FOUND);
    }
    return client;
  }

  async getClients(userId: number) {
    try {
      const clients = await this.prisma.client.findMany();
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelos clientes", HttpStatus.BAD_REQUEST);
    }
  }

  async getMyPlan(userId: number) {
    const client = await this.prisma.client.findUnique({
      where: {
        userId: userId,
      },
      include: {
        plan: true,
      },
    });

    if (!client) throw new HttpException("Cliente não encontrado", HttpStatus.NOT_FOUND);

    return client.plan;
  }
}
