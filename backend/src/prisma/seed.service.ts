import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { buildDemoLessons } from '../common/demo-schedule';
import { PrismaService } from './prisma.service';

/**
 * Заполняет пустую базу демо-расписанием при старте приложения.
 * На Layero файловая система контейнера эфемерна: миграция создаёт
 * чистую SQLite-базу при каждом холодном старте, после чего этот сервис
 * загружает в неё 37 уроков 10-Б. Если база уже заполнена (локальная
 * разработка), данные не трогаются.
 */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap(): Promise<void> {
    const total = await this.prisma.lesson.count();
    if (total > 0) {
      return;
    }

    const lessons = buildDemoLessons();
    await this.prisma.lesson.createMany({ data: lessons });
    this.logger.log(`Демо-данные загружены: ${lessons.length} уроков 10-Б`);
  }
}
