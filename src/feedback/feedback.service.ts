import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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

    if (!client && !barber) {
      throw new HttpException("Cliente e Barbeiro não encontrados", HttpStatus.NOT_FOUND);
    }
    console.log("client: ", client);
    console.log("barber: ", barber);
    try {
      // Suposição: O DTO de criação terá rating, comment, barberId e clientId.
      const newFeedback = await this.prisma.feedBack.create({
        data: {
          rating: createFeedbackDto.rating,
          comment: createFeedbackDto.comment,
          barberId: createFeedbackDto.barberId,
          clientId: createFeedbackDto.barberId,
        },
      });
      console.log("new feedback", newFeedback);
      return newFeedback;
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        throw new HttpException("Você já avaliou este profissional.", HttpStatus.CONFLICT);
      }

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

  async findFeedbacksByUser(userId: number, role: string) {
    try {
      let whereClause = {}; // Este será o filtro dinâmico

      // 1. Se o usuário for um cliente...
      if (role === "CLIENT") {
        // ...precisamos encontrar o ID do perfil de cliente dele
        const client = await this.prisma.client.findUnique({
          where: { userId: userId },
          select: { id: true },
        });

        // Se não tiver perfil de cliente, não tem feedbacks
        if (!client) {
          return [];
        }
        // Define o filtro para buscar pelo clientId
        whereClause = { clientId: client.id };

        // 2. Se o usuário for um barbeiro...
      } else if (role === "BARBER") {
        // ...precisamos encontrar o ID do perfil de barbeiro dele
        const barber = await this.prisma.barber.findUnique({
          where: { userId: userId },
          select: { id: true },
        });

        // Se não tiver perfil de barbeiro, não tem feedbacks
        if (!barber) {
          return [];
        }
        // Define o filtro para buscar pelo barberId
        whereClause = { barberId: barber.id };
      } else {
        // 3. Se a role for desconhecida (ex: 'admin')
        throw new UnauthorizedException("Cargo de usuário inválida para esta ação.");
      }

      // 4. Executa a busca na tabela FeedBack com o filtro correto
      const feedbacks = await this.prisma.feedBack.findMany({
        where: whereClause, // Usa o filtro dinâmico
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
        throw error; // Repassa o erro de autorização
      }
      console.error("Erro ao buscar feedbacks:", error); // Loga o erro real
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
