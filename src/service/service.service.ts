import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createServiceDto: CreateServiceDto) {
    try {
      const newService = await this.prisma.service.create({
        data: {
          description: createServiceDto.description,
        },
      });

      return newService;
    } catch (error) {
      throw new HttpException("Não foi possivel criar o serviço", HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const services = await this.prisma.service.findMany();

      if (!services) throw new HttpException("Não foi possivel localizar os serviços", HttpStatus.NOT_FOUND);

      return services;
    } catch (error) {
      throw new HttpException("Não foi possivel localizar os serviços", HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const service = await this.prisma.service.findUnique({
        where: {
          id: id,
        },
      });

      if (!service) throw new HttpException("Não foi possivel localizar o serviço", HttpStatus.NOT_FOUND);

      return service;
    } catch (error) {
      throw new HttpException("Não foi possivel localizar o serviço", HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      const findService = await this.prisma.service.findUnique({
        where: {
          id: id,
        },
      });
      if (!findService) throw new HttpException("Não foi possivel localizar o serviço", HttpStatus.NOT_FOUND);

      const service = await this.prisma.service.update({
        where: {
          id: findService.id,
        },
        data: updateServiceDto,
      });

      return service;
    } catch (error) {
      throw new HttpException("Não foi possivel atualizar o serviço", HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const findService = await this.prisma.service.findUnique({
        where: {
          id: id,
        },
      });
      if (!findService) throw new HttpException("Não foi possivel localizar o serviço", HttpStatus.NOT_FOUND);

      await this.prisma.service.delete({
        where: {
          id: findService.id,
        },
      });

      return findService;
    } catch (error) {
      throw new HttpException("Não foi possivel exlcuir o serviço", HttpStatus.BAD_REQUEST);
    }
  }
}
