import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { Role } from "generated/prisma/client";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, role: Role): Promise<Omit<User, "password">> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    try {
      const newUser = await this.prisma.$transaction(async (tx) => {
        // 1. Criar o User
        const user = await tx.user.create({
          data: {
            email: createUserDto.email,
            name: createUserDto.name,
            password: hashedPassword,
            phone: createUserDto.phone,
            role: role,
          },
        });

        // 2. Criar o Perfil associado
        if (user.role === Role.BARBER) {
          await tx.barber.create({
            data: {
              userId: user.id,
            },
          });
        } else if (user.role === Role.CLIENT) {
          await tx.client.create({
            data: {
              userId: user.id,
            },
          });
        }
        return user;
      });

      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException("Não foi possivel criar o usuario", HttpStatus.BAD_REQUEST);
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

  async findById(id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new HttpException("Não foi possivel encontrar o usuario", HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelo usuario", HttpStatus.BAD_REQUEST);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user) {
        return user;
      }

      return null;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelo usuario", HttpStatus.BAD_REQUEST);
    }
  }

  
  async update(id: number, UpdateUserDto: UpdateUserDto) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });
      if (!findUser) {
        throw new HttpException("Este usuario não existe", HttpStatus.NOT_FOUND);
      }

      const user = await this.prisma.user.update({
        where: {
          id: findUser.id,
        },
        data: UpdateUserDto,
      });

      return user;
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
