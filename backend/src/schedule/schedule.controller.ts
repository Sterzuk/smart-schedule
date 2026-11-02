import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FilterScheduleDto } from '../filters/dto/filter-schedule.dto';
import { FiltersService } from '../filters/filters.service';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly filtersService: FiltersService,
  ) {}

  @Get()
  async findAll() {
    const [lessons, options] = await Promise.all([
      this.scheduleService.getAll(),
      this.filtersService.getOptions(),
    ]);

    return {
      success: true,
      lessons,
      total: lessons.length,
      appliedFilters: {},
      options,
    };
  }

  @Get('filter')
  async filter(@Query() dto: FilterScheduleDto) {
    const [lessons, options] = await Promise.all([
      this.scheduleService.filter(dto),
      this.filtersService.getOptions(),
    ]);

    return {
      success: true,
      lessons,
      total: lessons.length,
      appliedFilters: dto,
      options,
    };
  }

  @Get('options')
  async getOptions() {
    return {
      success: true,
      options: await this.filtersService.getOptions(),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      success: true,
      lesson: await this.scheduleService.getOne(id),
    };
  }
}
