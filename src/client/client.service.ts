import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateClientDto } from "./dto/update-client.dto";
import { promises } from "dns";
import { Prisma } from "generated/prisma/client";

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async updateClient(userId: number, updadateClientDto: UpdateClientDto) {
    try {
      const dataToUpdate: Prisma.ClientUpdateInput = {};
      if (updadateClientDto.planId) {
        dataToUpdate.plan = {
          connect: {
            id: updadateClientDto.planId,
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
      include: {
        plan: true,
        feedback: true,
      },
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

  async getClientsForPlan() {
    try {
      const clients = await this.prisma.client.findMany({
        select: {
          id: true,
          user: {
            select: { name: true, phone: true },
          },
          plan: {
            select: { id: true, haircutNumber: true, value: true },
          },
        },
      });

      return clients;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelos clientes", HttpStatus.BAD_REQUEST);
    }
  }

  async updateClientPlan(clientId: number, planId: number | null) {
    try {
      return this.prisma.client.update({
        where: {
          id: clientId,
        },
        data: {
          planId: planId,
        },
        select: {
          id: true,
          user: { select: { name: true } },
          plan: { select: { id: true, haircutNumber: true, value: true } },
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException("Não foi possivel atualizar o plano do cliente", HttpStatus.BAD_REQUEST);
    }
  }
}
