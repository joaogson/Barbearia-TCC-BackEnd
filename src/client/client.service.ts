import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UNABLE_TO_FIND_POSTINSTALL_TRIGGER_JSON_PARSE_ERROR } from "@prisma/client/scripts/postinstall.js";

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    try {
      const newClient = await this.prisma.client.create({
        data: {
          name: createClientDto.name,
          email: createClientDto.email,
          phone: createClientDto.phone,
          username: createClientDto.username,
          password: createClientDto.password,
        },
      });

      return newClient;
    } catch (error) {
      throw new HttpException("Não foi possivel criar o cliente", HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const clients = await this.prisma.client.findMany();

      if (!clients) {
        throw new HttpException("Não foi possivel encontrar nenhum cliente", HttpStatus.NOT_FOUND);
      }

      return clients;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelos clientes", HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const client = await this.prisma.client.findFirst({
        where: {
          id: id,
        },
      });

      if (!client) {
        throw new HttpException("Não foi possivel encontrar o cliente", HttpStatus.NOT_FOUND);
      }

      return client;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelo cliente", HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    try {
      const findClient = await this.prisma.client.findFirst({
        where: {
          id: id,
        },
      });
      if (!findClient) {
        throw new HttpException("Este cliente não existe", HttpStatus.NOT_FOUND);
      }

      const client = await this.prisma.client.update({
        where: {
          id: findClient.id,
        },
        data: updateClientDto,
      });

      return client;
    } catch (error) {
      throw new HttpException("Não foi possivel atualizar os dados deste cliente", HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const client = await this.prisma.client.findFirst({
        where: {
          id: id,
        },
      });

      if (!client) {
        throw new HttpException("Este cliente não existe", HttpStatus.NOT_FOUND);
      }

      await this.prisma.client.delete({
        where: {
          id: client.id,
        },
      });

      return client;
    } catch (error) {
      throw new HttpException("Não foi possivel excluir este cliente", HttpStatus.BAD_REQUEST);
    }
  }
}
