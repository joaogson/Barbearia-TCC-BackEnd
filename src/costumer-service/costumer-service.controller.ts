import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CostumerService } from "./costumer-service.service";
import { CreateCostumerServiceDto } from "./dto/create-costumer-service.dto";
import { UpdateCostumerServiceDto } from "./dto/update-costumer-service.dto";

@Controller("costumer-service")
export class CostumerServiceController {
  constructor(private readonly costumerServiceService: CostumerService) {}

  @Post()
  create(@Body() createCostumerServiceDto: CreateCostumerServiceDto) {
    return this.costumerServiceService.create(createCostumerServiceDto);
  }

  @Get()
  findAll() {
    return this.costumerServiceService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.costumerServiceService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCostumerServiceDto: UpdateCostumerServiceDto) {
    return this.costumerServiceService.update(+id, updateCostumerServiceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.costumerServiceService.remove(+id);
  }
}
