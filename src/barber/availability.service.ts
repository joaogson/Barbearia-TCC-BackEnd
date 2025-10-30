import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { format } from "path";
import { PrismaService } from "src/prisma/prisma.service";
import { formatTimeFromDate, minutesToTime, timeToMinutes } from "src/utils/time.utils";

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getAvailableSlots(barberId: number, date: string, serviceIds: number[]) {
    try {
      if (!date || !serviceIds) throw new HttpException("Data e serviços são obrigatorio", HttpStatus.BAD_REQUEST);

      if (serviceIds.length === 0) throw new HttpException("Pelo menos um serviço deve ser selecionado", HttpStatus.BAD_REQUEST);

      //1. Calcular a duração total dos serviços selecionados no agendamento
      const services = await this.prisma.service.findMany({
        where: {
          id: {
            in: serviceIds,
          },
        },
      });

      if (services.length !== serviceIds.length) throw new HttpException("Serviços invalidos", HttpStatus.BAD_REQUEST);
      const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);

      //2. Buscar todas as restrições de horarios do barbeiro no dia
      const [barber, costumerServices, inactivePeriods] = await Promise.all([
        this.prisma.barber.findUnique({ where: { id: barberId } }),
        this.prisma.costumerService.findMany({ where: { barberId: barberId } }),
        this.prisma.inactivePeriod.findMany({ where: { barbedId: barberId } }),
      ]);

      if (!barber) throw new HttpException("Não foi possivel encontrar o barbeiro", HttpStatus.NOT_FOUND);
      //3. Gerar os slots de horarios
      const slots: string[] = [];
      const startMinutes = timeToMinutes(barber?.workStartTime);
      const endMinutes = timeToMinutes(barber?.workEndTime);
      const interval = 15;
      for (let i = startMinutes; i < endMinutes; i += interval) {
        slots.push(minutesToTime(i));
      }

      //4. Filtrar os slots validos, aplicando as regras
      //de verificação se o serviço vai adentrar em algum horario
      // invalido para atendimento, seja no começo do horario ou no final

      const availableSlots = slots.filter((slot) => {
        const slotStart = timeToMinutes(slot);
        const slotEnd = slotStart + totalDuration;

        // se o agendamento termina depois do horario de expediente
        if (slotEnd > endMinutes) return false;

        //Conflita com um periodo invalido
        const isInactive = inactivePeriods.some((p) => slotStart < timeToMinutes(p.endTime) && slotEnd > timeToMinutes(p.startTime));
        if (isInactive) return false;

        // Conflita com outro agendamento existente
        const inCostumerService = costumerServices.some((c) => {
          const costumerServiceStart = timeToMinutes(formatTimeFromDate(c.ServiceTime));
          const costumerServiceEnd = costumerServiceStart + c.totalDuration;
          return slotStart < costumerServiceEnd && slotEnd > costumerServiceStart;
        });
        if (inCostumerService) return false;

        return true;
      });
      return availableSlots;
    } catch (error) {
      throw new HttpException("Não foi possivel resgatar os horarios disponiveis", HttpStatus.BAD_REQUEST);
    }
  }
}
