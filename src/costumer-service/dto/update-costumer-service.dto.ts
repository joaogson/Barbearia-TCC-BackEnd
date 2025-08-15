import { PartialType } from '@nestjs/mapped-types';
import { CreateCostumerServiceDto } from './create-costumer-service.dto';

export class UpdateCostumerServiceDto extends PartialType(CreateCostumerServiceDto) {}
