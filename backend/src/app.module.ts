import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ChatbotModule } from './chatbot/chatbot.module';
import { FiltersModule } from './filters/filters.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    FiltersModule,
    ScheduleModule,
    ChatbotModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
