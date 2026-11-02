const base = (process.env.API_URL ?? 'http://localhost:3001/api').replace(
  /\/$/,
  '',
);

async function request(path, init) {
  const response = await fetch(base + path, init);
  const body = await response.json();
  return { status: response.status, body };
}

function get(path) {
  return request(path);
}

function post(path, data) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const checks = [];
function check(name, condition, details) {
  assert(condition, details ? `${name}: ${details}` : name);
  checks.push(name);
}

try {
  const health = await get('/health');
  check(
    'health',
    health.status === 200 && health.body.status === 'ok',
    JSON.stringify(health.body),
  );

  const all = await get('/schedule');
  check(
    'GET /schedule возвращает 37 уроков',
    all.status === 200 && all.body.success && all.body.total === 37,
    JSON.stringify(all.body).slice(0, 200),
  );
  check(
    'GET /schedule возвращает 1 класс',
    all.body.options.classes.length === 1,
  );
  check(
    'GET /schedule возвращает 20 предметов',
    all.body.options.subjects.length === 20,
  );
  check(
    'класс 10-Б в списке',
    all.body.options.classes.join(',') === '10-Б',
    all.body.options.classes.join(','),
  );

  const monday10B = await get(
    '/schedule/filter?className=' +
      encodeURIComponent('10-Б') +
      '&day=' +
      encodeURIComponent('Понедельник'),
  );
  check(
    '10-Б в понедельник содержит 8 уроков',
    monday10B.status === 200 &&
      monday10B.body.success &&
      monday10B.body.total === 8,
    `total=${monday10B.body.total}`,
  );
  const mondaySubjects = monday10B.body.lessons.map((lesson) => lesson.subject);
  check(
    'расписание 10-Б в понедельник соответствует данным',
    mondaySubjects[0] === 'Разговор о важном' &&
      mondaySubjects[1] === 'Химия' &&
      mondaySubjects[6] === 'Алгебра' &&
      mondaySubjects[7] === 'Алгебра' &&
      monday10B.body.lessons[0].room === '105' &&
      monday10B.body.lessons[7].room === '205/304',
    mondaySubjects.join(', '),
  );

  const combined = await get(
    '/schedule/filter?className=' +
      encodeURIComponent('10-Б') +
      '&day=' +
      encodeURIComponent('Понедельник') +
      '&startAfter=12%3A00',
  );
  check(
    'комбинированный фильтр класс + день + время',
    combined.body.total === 4 &&
      combined.body.lessons.every((lesson) => lesson.startTime > '12:00'),
    `total=${combined.body.total}`,
  );

  const physics = await get(
    '/schedule/filter?subject=' + encodeURIComponent('Физика'),
  );
  check(
    'точный фильтр по предмету «Физика»',
    physics.body.total > 0 &&
      physics.body.lessons.every(
        (lesson) => lesson.subject === 'Физика',
      ),
    `total=${physics.body.total}`,
  );

  const search = await get(
    '/schedule/filter?search=' + encodeURIComponent('физика'),
  );
  check(
    'регистронезависимый поиск по предмету',
    search.body.total > 0 &&
      search.body.lessons.every((lesson) =>
        lesson.subject.toLowerCase().includes('физика'),
      ),
    `total=${search.body.total}`,
  );

  const empty = await get(
    '/schedule/filter?className=' +
      encodeURIComponent('9-А') +
      '&day=' +
      encodeURIComponent('Понедельник'),
  );
  check('пустой результат фильтра', empty.body.total === 0);

  const firstLessonId = all.body.lessons[0].id;
  const one = await get(`/schedule/${firstLessonId}`);
  check(
    'GET /schedule/:id',
    one.status === 200 &&
      one.body.success &&
      one.body.lesson.id === firstLessonId,
  );

  const missing = await get('/schedule/999999');
  check(
    'GET /schedule/:id возвращает 404',
    missing.status === 404 &&
      missing.body.success === false &&
      missing.body.error.code === 'NOT_FOUND',
  );

  const invalidDay = await get(
    '/schedule/filter?day=' + encodeURIComponent('Суббота'),
  );
  check(
    'некорректный день возвращает 400',
    invalidDay.status === 400 &&
      invalidDay.body.success === false &&
      invalidDay.body.error.code === 'VALIDATION_ERROR',
  );

  const chatMath = await post('/chat', {
    message: 'Покажи уроки математики в понедельник',
  });
  check(
    'чат: группа предметов «математика»',
    chatMath.status === 200 &&
      chatMath.body.success &&
      chatMath.body.total > 0 &&
      chatMath.body.appliedFilters.day === 'Понедельник' &&
      chatMath.body.appliedFilters.subjects.includes('Алгебра'),
    JSON.stringify(chatMath.body.appliedFilters),
  );

  const chatWednesday = await post('/chat', {
    message: 'Расписание на среду для 10-Б',
  });
  check(
    'чат: день для 10-Б',
    chatWednesday.body.total === 8 &&
      chatWednesday.body.lessons.every(
        (lesson) => lesson.className === '10-Б' && lesson.day === 'Среда',
      ),
    `total=${chatWednesday.body.total}`,
  );

  const chatAfter = await post('/chat', {
    message: 'Какие уроки начинаются после 12:00?',
  });
  check(
    'чат: начало после указанного времени',
    chatAfter.body.appliedFilters.startAfter === '12:00' &&
      chatAfter.body.lessons.every((lesson) => lesson.startTime > '12:00'),
  );

  const chatEndsAfter = await post('/chat', {
    message: 'Какие уроки в понедельник заканчиваются после 14:00?',
  });
  check(
    'чат: окончание после указанного времени',
    chatEndsAfter.body.appliedFilters.endAfter === '14:00' &&
      chatEndsAfter.body.lessons.every((lesson) => lesson.endTime > '14:00'),
  );

  const chatMath10B = await post('/chat', {
    message: 'Когда математика у 10-Б?',
  });
  check(
    'чат: математика у 10-Б',
    chatMath10B.body.total > 0 &&
      chatMath10B.body.lessons.every(
        (lesson) => lesson.className === '10-Б',
      ),
  );

  const chatWeek = await post('/chat', {
    message: 'Покажи все уроки на этой неделе',
  });
  check(
    'чат: полная неделя',
    chatWeek.body.total === 37,
    `total=${chatWeek.body.total}`,
  );

  const chatSunday = await post('/chat', {
    message: 'Какие уроки в воскресенье?',
  });
  check(
    'чат: выходной день',
    chatSunday.body.intent === 'off_day' &&
      chatSunday.body.lessons.length === 0,
  );

  const emptyChat = await post('/chat', { message: '   ' });
  check(
    'чат: пустое сообщение возвращает 400',
    emptyChat.status === 400 && emptyChat.body.success === false,
  );

  const unknown = await post('/chat', {
    message: 'Расскажи шутку про кота',
  });
  check(
    'чат: неизвестный запрос не выдумывает уроки',
    unknown.body.intent === 'unrecognized' &&
      unknown.body.lessons.length === 0,
  );

  console.log(`API smoke: ${checks.length} проверок пройдено.`);
  for (const name of checks) {
    console.log(`  ✓ ${name}`);
  }
  console.log(
    JSON.stringify(
      {
        lessons: all.body.total,
        classes: all.body.options.classes,
        subjects: all.body.options.subjects.length,
        chatMath: chatMath.body.reply,
        chatAfter: chatAfter.body.reply,
        chatSunday: chatSunday.body.reply,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(`API smoke: ОШИБКА — ${error.message}`);
  console.error(`Убедитесь, что backend запущен: ${base}`);
  process.exitCode = 1;
}
