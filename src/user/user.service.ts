import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-User.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          phone: createUserDto.phone,
          password: createUserDto.password,
        },
      });

      return newUser;
    } catch (error) {
      throw new HttpException("Não foi possivel criar o barbeiro", HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();

      if (!users) {
        throw new HttpException("Não foi possivel encontrar nenhum usuario", HttpStatus.NOT_FOUND);
      }

      return users;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelos usuario", HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const barber = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!barber) {
        throw new HttpException("Não foi possivel encontrar o usuario", HttpStatus.NOT_FOUND);
      }

      return barber;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelo usuario", HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, UpdateUserDto: UpdateUserDto) {
    try {
      const findBarber = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });
      if (!findBarber) {
        throw new HttpException("Este usuario não existe", HttpStatus.NOT_FOUND);
      }

      const barber = await this.prisma.user.update({
        where: {
          id: findBarber.id,
        },
        data: UpdateUserDto,
      });

      return barber;
    } catch (error) {
      throw new HttpException("Não foi possivel atualizar os dados deste usuario", HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });
      console.log(findUser);

      if (!findUser) {
        throw new HttpException("Este usuario não existe", HttpStatus.NOT_FOUND);
      }

      await this.prisma.user.delete({
        where: {
          id: findUser.id,
        },
      });

      return findUser;
    } catch (error) {
      throw new HttpException("Não foi possivel excluir este usuario", HttpStatus.BAD_REQUEST);
    }
  }
}
