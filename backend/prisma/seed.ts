import { PrismaClient } from '@prisma/client';
import { buildDemoLessons } from '../src/common/demo-schedule';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const lessons = buildDemoLessons();

  await prisma.lesson.deleteMany();
  await prisma.lesson.createMany({ data: lessons });

  const [total, classesCount, subjectsCount] = await Promise.all([
    prisma.lesson.count(),
    prisma.lesson.findMany({ distinct: ['className'], select: { className: true } }),
    prisma.lesson.findMany({ distinct: ['subject'], select: { subject: true } }),
  ]);

  console.log('Демонстрационные данные загружены:');
  console.log(`  уроков: ${total}`);
  console.log(`  классов: ${classesCount.length}`);
  console.log(`  предметов: ${subjectsCount.length}`);
}

main()
  .catch((error: unknown) => {
    console.error('Не удалось загрузить демонстрационные данные:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
