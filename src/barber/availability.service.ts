import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { format, toDate } from "date-fns-tz";
import { PrismaService } from "src/prisma/prisma.service";

// --- CONFIGURAÇÃO DO DAY.JS ---
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
// --- FIM DA CONFIGURAÇÃO ---

export const TIMEZONE = "America/Sao_Paulo";

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
      console.log(`Duração total calculada: ${totalDuration} minutos`);
      console.log("Barber Id: ", barberId);
      const dayStart = dayjs.tz(date, TIMEZONE).startOf("day").toDate();
      const dayEnd = dayjs.tz(date, TIMEZONE).endOf("day").toDate();
      console.log("DayStart: ", dayStart);
      console.log("dayEnd: ", dayEnd);

      //2. Buscar todas as restrições de horarios do barbeiro no dia
      const [barber, costumerServices, inactivePeriods] = await Promise.all([
        this.prisma.barber.findUnique({ where: { id: barberId } }),
        this.prisma.costumerService.findMany({ where: { barberId: barberId, ServiceTime: { gte: dayStart, lte: dayEnd }, isCancelled: false } }),
        this.prisma.inactivePeriod.findMany({ where: { barbedId: barberId, date: { gte: dayStart, lte: dayEnd } } }),
      ]);

      console.log("Agendamentos encontrados neste dia:", costumerServices);
      console.log("Períodos inativos encontrados neste dia:", inactivePeriods);

      if (!barber) throw new HttpException("Não foi possivel encontrar o barbeiro", HttpStatus.NOT_FOUND);

      const breakTime = barber.breakBetweenCostumerService;
      const totalDurationCostumerService = totalDuration + breakTime;

      console.log("Regras do Barbeiro:", {
        start: barber.workStartTime,
        end: barber.workEndTime,
        breakBetweenCostumerService: barber.breakBetweenCostumerService,
      });

      // 3. Definir o início e fim do expediente como objetos Day.js
      const startDay = dayjs.tz(date, TIMEZONE).startOf("day");
      const workStart = dayjs(`${date} ${barber.workStartTime}`, "YYYY-MM-DD HH:mm", TIMEZONE);
      const workEnd = dayjs(`${date} ${barber.workEndTime}`, "YYYY-MM-DD HH:mm", TIMEZONE);

      //3. Gerar os slots de horarios
      const slots: dayjs.Dayjs[] = [];

      const interval = 15;
      let currentSlot = workStart;
      while (currentSlot.isBefore(workEnd)) {
        slots.push(currentSlot);
        currentSlot = currentSlot.add(interval, "minute");
      }
      console.log(slots);
      //4. Filtrar os slots validos, aplicando as regras
      //de verificação se o serviço vai adentrar em algum horario
      // invalido para atendimento, seja no começo do horario ou no final

      const availableSlots = slots.filter((slot) => {
        const slotEnd = slot.add(totalDurationCostumerService, "minute");

        // se o agendamento termina depois do horario de expediente
        if (slotEnd.isAfter(workEnd)) return false;

        //Conflita com um periodo invalido
        const isInactive = inactivePeriods.some((p) => {
          const periodStart = dayjs(`${date} ${p.startTime}`, "YYYY-MM-DD HH:mm", TIMEZONE);
          const periodEnd = dayjs(`${date} ${p.endTime}`, "YYYY-MM-DD HH:mm", TIMEZONE);
          console.log(`Inicio do horario: ${slot} é antes de ${periodEnd} e o termino do horario: ${slotEnd} é depois de ${periodStart}`);

          return slot.isBefore(periodEnd) && slotEnd.isAfter(periodStart);
        });
        if (isInactive) {
          return false;
        }

        // Conflita com outro agendamento existente
        const inCostumerService = costumerServices.some((c) => {
          const costumerServiceStart = dayjs(c.ServiceTime).tz(TIMEZONE);
          const existingCostumerServiceDuration = c.totalDuration + breakTime;
          const costumerServiceEnd = costumerServiceStart.add(existingCostumerServiceDuration, "minute");
          //console.log(`Horario de inicio do agendamento: ${costumerServiceStart.hour()} ${costumerServiceStart.minute()} `);
          //console.log(`Horario de termino do agendamento: ${costumerServiceEnd.hour()} ${costumerServiceEnd.minute()} `);
          return slot.isBefore(costumerServiceEnd) && slotEnd.isAfter(costumerServiceStart);
        });

        if (inCostumerService) {
          return false;
        }

        return true;
      });

      console.log("Horários disponíveis FINAIS:", availableSlots);
      console.log("--- FIM DO CÁLCULO ---");

      return availableSlots.map((slot) => slot.format());
    } catch (error) {
      console.error(error);
      throw new HttpException("Não foi possivel resgatar os horarios disponiveis", HttpStatus.BAD_REQUEST);
    }
  }
}
