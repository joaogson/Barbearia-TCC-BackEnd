import { ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { Role } from "generated/prisma/client";
import { User } from "./entities/user.entity";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, role: Role): Promise<Omit<User, "password">> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    try {
      const newUser = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: createUserDto.email,
            name: createUserDto.name,
            password: hashedPassword,
            phone: createUserDto.phone,
            role: role,
          },
        });

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

  async findById(id: number) {
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
        const { password, ...result } = user;
        return user;
      }

      return null;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelo usuario", HttpStatus.BAD_REQUEST);
    }
  }

  async update(userId: number, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });

      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException("Não foi possivel atualizar o usuario", HttpStatus.BAD_REQUEST);
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

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    const isPasswordValid = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException("A senha atual está incorreta.");
    }

    if (updatePasswordDto.currentPassword === updatePasswordDto.newPassword) {
      throw new ConflictException("A nova senha não pode ser igual à senha atual.");
    }

    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(updatePasswordDto.newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash },
    });

    return { message: "Senha atualizada com sucesso." };
  }

  async updateUserRole(userId: number, role: Role) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`Usuário não encontrado.`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: role },
    });

    if (updatedUser.role === Role.BARBER) {
      const barberProfile = await this.prisma.barber.findUnique({
        where: { userId: userId },
      });

      if (!barberProfile) {
        await this.prisma.barber.create({
          data: { userId: userId },
        });
      }

      const clientProfile = await this.prisma.client.findUnique({
        where: { userId: userId },
      });

      if (clientProfile) {
        await this.prisma.client.delete({
          where: { userId: userId },
        });
      }
    }

    const { password, ...result } = updatedUser;
    return result;
  }
}
