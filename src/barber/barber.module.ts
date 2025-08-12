import { Module } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';

@Module({
  controllers: [BarberController],
  providers: [BarberService],
})
export class BarberModule {}
