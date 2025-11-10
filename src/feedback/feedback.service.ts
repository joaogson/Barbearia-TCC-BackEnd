import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo feedback no banco de dados.
   * @param createFeedbackDto - Dados para a criação do feedback.
   */
  async create(createFeedbackDto: CreateFeedbackDto) {
    try {
      // Suposição: O DTO de criação terá rating, comment, barberId e clientId.
      const newFeedback = await this.prisma.feedBack.create({
        data: {
          rating: createFeedbackDto.rating,
          comment: createFeedbackDto.comment,
          barber: {
            connect: {
              id: createFeedbackDto.barberId,
            },
          },
          client: {
            connect: {
              id: createFeedbackDto.clientId,
            },
          },
        },
      });

      return newFeedback;
    } catch (error) {
      // Trata erros de chave estrangeira (ex: barberId ou clientId não existem)
      throw new HttpException("Não foi possível registrar o feedback.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retorna todos os feedbacks cadastrados.
   */
  async findAll() {
    try {
      const feedbacks = await this.prisma.feedBack.findMany({
        include: {
          barber: true, // Inclui os dados do barbeiro
          client: true, // Inclui os dados do cliente
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
      // Se não for um barbeiro (ex: é um cliente), retorna lista vazia
      return [];
    }

    return this.findByBarber(barber.id);
  }

  async findMyFeedBack(clientId: number) {
    try {
      const feedbacks = await this.prisma.feedBack.findMany({
        where: {
          clientId: clientId,
        },
        select: {
          id: true,
          comment: true,
          rating: true,
          client: { select: { user: { select: { name: true, id: true } } } },
          barber: { select: { user: { select: { name: true, id: true } } } },
        },
      });
      return feedbacks;
    } catch (error) {
      throw new HttpException("Ocorreu um erro ao buscar os feedbacks.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Encontra um feedback específico pelo ID.
   * @param id - O ID do feedback a ser encontrado.
   */
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

  /**
   * Atualiza os dados de um feedback.
   * @param id - O ID do feedback a ser atualizado.
   * @param updateFeedbackDto - Os novos dados para o feedback.
   */
  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    // Primeiro, verifica se o feedback existe
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

  /**
   * Remove um feedback do banco de dados.
   * @param id - O ID do feedback a ser removido.
   */
  async remove(id: number) {
    // Primeiro, verifica se o feedback existe para garantir uma mensagem de erro clara
    const feedbackToRemove = await this.findOne(id);

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
