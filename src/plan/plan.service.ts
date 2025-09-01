import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlanDto: CreatePlanDto) {
    try {
      const newPlan = await this.prisma.plan.create({
        data: {
          value: createPlanDto.value,
          haircutNumber: createPlanDto.haircutNumber,
          client: {
            connect: {
              id: createPlanDto.clientId,
            },
          },
        },
      });

      if (!newPlan) throw new HttpException("O cliente com o id nao foi encontrado", HttpStatus.NOT_FOUND);

      return newPlan;
    } catch (error) {
      throw new HttpException("Não foi possivel criar o plano", HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const plans = await this.prisma.plan.findMany();

      if (!plans) throw new HttpException("Não foi possivel encontrar nenhum plano", HttpStatus.NOT_FOUND);

      return plans;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelos planos", HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const plan = await this.prisma.plan.findFirst({
        where: {
          id: id,
        },
      });
      if (!plan) throw new HttpException("Não foi possivel encontrar nenhum plano com esse id", HttpStatus.NOT_FOUND);

      return plan;
    } catch (error) {
      throw new HttpException("Não foi possivel buscar pelo plano", HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updatePlanDto: UpdatePlanDto) {
    try {
      const findPlan = await this.prisma.plan.findFirst({
        where: {
          id: id,
        },
      });

      if (!findPlan) throw new HttpException("Não foi possivel encontrar nenhum plano com esse id", HttpStatus.NOT_FOUND);

      const plan = await this.prisma.plan.update({
        where: {
          id: findPlan.id,
        },
        data: updatePlanDto,
      });

      return plan;
    } catch (error) {
      throw new HttpException("Não foi possivel atualizar o plano", HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const findPlan = await this.prisma.plan.findFirst({
        where: {
          id: id,
        },
      });

      if (!findPlan) throw new HttpException("Não foi possivel encontrar nenhum plano com esse id", HttpStatus.NOT_FOUND);

      await this.prisma.plan.delete({
        where: {
          id: findPlan.id,
        },
      });

      return findPlan;
    } catch (error) {
      throw new HttpException("Não foi possivel excluir o plano", HttpStatus.BAD_REQUEST);
    }
  }
}
