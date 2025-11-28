import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto, userId: number) {
    const barber = await this.prisma.barber.findUnique({
      where: {
        id: createFeedbackDto.barberId,
      },
    });

    const client = await this.prisma.client.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!client) {
      throw new HttpException("Cliente não encontrado", HttpStatus.NOT_FOUND);
    }
    if (!barber) {
      throw new HttpException("Barbeiro não encontrado", HttpStatus.NOT_FOUND);
    }

    try {
      const newFeedback = await this.prisma.feedBack.create({
        data: {
          rating: createFeedbackDto.rating,
          comment: createFeedbackDto.comment,
          barberId: createFeedbackDto.barberId,
          clientId: client?.id,
        },
      });

      return newFeedback;
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        throw new HttpException("Você já avaliou este profissional.", HttpStatus.CONFLICT);
      }

      throw new HttpException("Não foi possível registrar o feedback.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const feedbacks = await this.prisma.feedBack.findMany({
        include: {
          barber: true,
          client: true,
        },
      });
      return feedbacks;
    } catch (error) {
      throw new HttpException("Ocorreu um erro ao buscar os feedbacks.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByBarber(barberId: number) {
    try {
      const feedbacks = await this.prisma.feedBack.findMany({
        where: {
          barberId: barberId,
        },
        select: {
          id: true,
          comment: true,
          rating: true,
          client: { select: { user: { select: { name: true, id: true } } } },
          barber: { select: { user: { select: { name: true, id: true } } } },
        },
        take: 4,
      });
      return feedbacks;
    } catch (error) {
      throw new HttpException("Ocorreu um erro ao buscar os feedbacks.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findMyBarberFeedBacks(userId: number) {
    const barber = await this.prisma.barber.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!barber) {
      return [];
    }

    return this.findByBarber(barber.id);
  }

  async findFeedbacksByUser(userId: number, role: string) {
    try {
      let whereClause = {};

      if (role === "CLIENT") {
        const client = await this.prisma.client.findUnique({
          where: { userId: userId },
          select: { id: true },
        });

        if (!client) {
          return [];
        }
        whereClause = { clientId: client.id };
      } else if (role === "BARBER") {
        const barber = await this.prisma.barber.findUnique({
          where: { userId: userId },
          select: { id: true },
        });

        if (!barber) {
          return [];
        }

        whereClause = { barberId: barber.id };
      } else {
        throw new UnauthorizedException("Cargo de usuário inválida para esta ação.");
      }

      const feedbacks = await this.prisma.feedBack.findMany({
        where: whereClause,
        select: {
          id: true,
          comment: true,
          rating: true,
          client: { select: { user: { select: { name: true, id: true } } } },
          barber: { select: { user: { select: { name: true, id: true } } } },
        },
        orderBy: {
          id: "desc",
        },
      });

      return feedbacks;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error("Erro ao buscar feedbacks:", error);
      throw new HttpException("Ocorreu um erro ao buscar os feedbacks.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    const feedback = await this.prisma.feedBack.findUnique({
      where: { id },
      include: {
        barber: true,
        client: true,
      },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback com ID ${id} não encontrado.`);
    }

    return feedback;
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    await this.findOne(id);

    try {
      const updatedFeedback = await this.prisma.feedBack.update({
        where: { id },
        data: updateFeedbackDto,
      });

      return updatedFeedback;
    } catch (error) {
      throw new HttpException("Não foi possível atualizar o feedback.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    const feedbackToRemove = await this.prisma.feedBack.findUnique({
      where: {
        id: id,
      },
    });
    console.log(feedbackToRemove);
    try {
      await this.prisma.feedBack.delete({
        where: { id },
      });

      return { message: `Feedback com ID ${id} foi removido com sucesso.` };
    } catch (error) {
      throw new HttpException("Não foi possível remover o feedback.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
