import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateBarberDto } from "./dto/create-barber.dto";
import { UpdateBarberDto } from "./dto/update-barber.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BarberService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBarberDto: CreateBarberDto) {
    try {
      const newBarber = await this.prisma.barber.create({
        data: {
          name: createBarberDto.name,
          email: createBarberDto.email,
          phone: createBarberDto.phone,
          username: createBarberDto.username,
          password: createBarberDto.password,
        },
      });

      return newBarber;
    } catch (error) {
      throw new HttpException("Não foi possivel criar o barbeiro", HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const barbers = await this.prisma.barber.findMany();

      if (!barbers) {
        throw new HttpException("Não foi possivel encontrar nenhum barbeiro", HttpStatus.NOT_FOUND);
      }

      return barbers;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelos barbeiros", HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const barber = await this.prisma.barber.findFirst({
        where: {
          id: id,
        },
      });

      if (!barber) {
        throw new HttpException("Não foi possivel encontrar o barbeiro", HttpStatus.NOT_FOUND);
      }

      return barber;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelo barbeiro", HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateBarberDto: UpdateBarberDto) {
    try {
      const findBarber = await this.prisma.barber.findFirst({
        where: {
          id: id,
        },
      });
      if (!findBarber) {
        throw new HttpException("Este barbeiro não existe", HttpStatus.NOT_FOUND);
      }

      const barber = await this.prisma.barber.update({
        where: {
          id: findBarber.id,
        },
        data: updateBarberDto,
      });

      return barber;
    } catch (error) {
      throw new HttpException("Não foi possivel atualizar os dados deste barbeiro", HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const findBarber = await this.prisma.barber.findFirst({
        where: {
          id: id,
        },
      });
      console.log(findBarber);

      if (!findBarber) {
        throw new HttpException("Este barbeiro não existe", HttpStatus.NOT_FOUND);
      }

      await this.prisma.barber.delete({
        where: {
          id: findBarber.id,
        },
      });

      return findBarber;
    } catch (error) {
      throw new HttpException("Não foi possivel excluir este barbeiro", HttpStatus.BAD_REQUEST);
    }
  }
}
