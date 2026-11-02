/*
 * Запуск backend в контейнере Layero:
 * 1) применяет миграции Prisma к локальной SQLite-базе;
 * 2) запускает NestJS, который при старте заполняет пустую базу демо-данными.
 *
 * Один Node-процесс вместо цепочки shell-команд — предсказуемо работает
 * в Linux-контейнере и не зависит от npx/tsx.
 */
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const migration = spawnSync(
  process.execPath,
  [path.join(__dirname, 'prisma-cli.cjs'), 'migrate', 'deploy'],
  { cwd: root, env: process.env, stdio: 'inherit' },
);

if (migration.error) {
  console.error('Не удалось запустить миграции Prisma:', migration.error);
  process.exit(1);
}

if (migration.status !== 0) {
  process.exit(migration.status ?? 1);
}

require(path.join(root, 'dist', 'main.js'));
