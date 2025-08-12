import { Injectable } from '@nestjs/common';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';

@Injectable()
export class BarberService {
  create(createBarberDto: CreateBarberDto) {
    return 'This action adds a new barber';
  }

  findAll() {
    return `This action returns all barber`;
  }

  findOne(id: number) {
    return `This action returns a #${id} barber`;
  }

  update(id: number, updateBarberDto: UpdateBarberDto) {
    return `This action updates a #${id} barber`;
  }

  remove(id: number) {
    return `This action removes a #${id} barber`;
  }
}
