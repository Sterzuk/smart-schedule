/*
 * Запускает Prisma CLI. Если в проекте присутствуют заранее подготовленные
 * бинарники движков (.prisma-engines), использует их. Это полезно в средах,
 * где загрузка с binaries.prisma.sh ограничена. На обычной машине файлов нет,
 * и Prisma работает стандартным образом.
 */
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const root = path.resolve(__dirname, '..');
const enginesDir = path.join(root, '.prisma-engines');
const env = { ...process.env };

const localSchemaEngine = path.join(enginesDir, 'schema-engine.exe');
const localQueryEngine = path.join(
  enginesDir,
  'query_engine-windows.dll.node',
);

if (fs.existsSync(localSchemaEngine)) {
  env.PRISMA_SCHEMA_ENGINE_BINARY = localSchemaEngine;
}
if (fs.existsSync(localQueryEngine)) {
  env.PRISMA_QUERY_ENGINE_LIBRARY = localQueryEngine;
}

const cliPath = require.resolve('prisma/build/index.js');
const result = spawnSync(process.execPath, [cliPath, ...process.argv.slice(2)], {
  cwd: root,
  env,
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
