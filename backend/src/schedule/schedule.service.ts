import { Injectable, NotFoundException } from '@nestjs/common';
import { FiltersService } from '../filters/filters.service';
import { FilterScheduleDto } from '../filters/dto/filter-schedule.dto';
import { LessonFilters, LessonResponse } from '../filters/filters.types';

@Injectable()
export class ScheduleService {
  constructor(private readonly filtersService: FiltersService) {}

  async getAll(): Promise<LessonResponse[]> {
    return this.filtersService.findLessons({});
  }

  async filter(dto: FilterScheduleDto): Promise<LessonResponse[]> {
    const filters: LessonFilters = {
      day: dto.day,
      className: dto.className,
      subject: dto.subject,
      search: dto.search,
      room: dto.room,
      startAfter: dto.startAfter,
      startBefore: dto.startBefore,
      endAfter: dto.endAfter,
      endBefore: dto.endBefore,
      lessonNumber: dto.lessonNumber,
    };
    return this.filtersService.findLessons(filters);
  }

  async getOne(id: number): Promise<LessonResponse> {
    const lesson = await this.filtersService.findLessonById(id);
    if (!lesson) {
      throw new NotFoundException(`Урок с идентификатором ${id} не найден`);
    }
    return lesson;
  }
}
