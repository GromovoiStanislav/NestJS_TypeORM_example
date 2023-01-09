import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('seed')
  async seed() {
    await this.appService.seed();
    return "Seed complete";
  }


  @Get('info/:id')
  async getEmployeeById(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getEmployeeById(id)
  }

  @Get('delete/:id')
  async deleteEmployeeById(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteEmployeeById(id)
  }
}
