import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { canonicalDay, normalizeTimeValue } from '../../common/date.utils';
import { WEEKDAYS, Weekday } from '../../common/schedule.constants';
import { Transform } from 'class-transformer';

const isTime = /^([01]\d|2[0-3]):[0-5]\d$/;

function trim(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function toDay(value: unknown): unknown {
  return typeof value === 'string' ? (canonicalDay(value) ?? value) : value;
}

function toTime(value: unknown): unknown {
  return typeof value === 'string' ? (normalizeTimeValue(value) ?? value) : value;
}

export class FilterScheduleDto {
  @IsOptional()
  @Transform(({ value }) => toDay(value))
  @IsIn(WEEKDAYS, {
    message: `День должен быть одним из: ${WEEKDAYS.join(', ')}`,
  })
  day?: Weekday;

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(20, { message: 'Название класса слишком длинное' })
  className?: string;

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(100, { message: 'Название предмета слишком длинное' })
  subject?: string;

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(100, { message: 'Поисковый запрос слишком длинный' })
  search?: string;

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(30)
  room?: string;

  @IsOptional()
  @Transform(({ value }) => toTime(value))
  @Matches(isTime, { message: 'startAfter должен быть во времени HH:mm' })
  startAfter?: string;

  @IsOptional()
  @Transform(({ value }) => toTime(value))
  @Matches(isTime, { message: 'startBefore должен быть во времени HH:mm' })
  startBefore?: string;

  @IsOptional()
  @Transform(({ value }) => toTime(value))
  @Matches(isTime, { message: 'endAfter должен быть во времени HH:mm' })
  endAfter?: string;

  @IsOptional()
  @Transform(({ value }) => toTime(value))
  @Matches(isTime, { message: 'endBefore должен быть во времени HH:mm' })
  endBefore?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Номер урока должен быть целым числом' })
  @Min(1)
  @Max(12)
  lessonNumber?: number;
}
