import { Injectable } from '@nestjs/common';
import { CreateCostumerServiceDto } from './dto/create-costumer-service.dto';
import { UpdateCostumerServiceDto } from './dto/update-costumer-service.dto';

@Injectable()
export class CostumerServiceService {
  create(createCostumerServiceDto: CreateCostumerServiceDto) {
    return 'This action adds a new costumerService';
  }

  findAll() {
    return `This action returns all costumerService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} costumerService`;
  }

  update(id: number, updateCostumerServiceDto: UpdateCostumerServiceDto) {
    return `This action updates a #${id} costumerService`;
  }

  remove(id: number) {
    return `This action removes a #${id} costumerService`;
  }
}
