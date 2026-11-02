import type {
  ChatApiResponse,
  ScheduleApiResponse,
  ScheduleFilters,
} from '@/types/schedule';

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'
).replace(/\/$/, '');

export class ApiError extends Error {
  status?: number;
  details?: string[];

  constructor(message: string, status?: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function buildQuery(filters: ScheduleFilters): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === 'string' && value.trim()) {
      params.set(key, value.trim());
    } else if (typeof value === 'number') {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new ApiError(
      'Не удалось подключиться к серверу. Убедитесь, что backend запущен на порту 3001.',
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(
      'Сервер вернул некорректный ответ. Попробуйте ещё раз.',
      response.status,
    );
  }

  if (
    !response.ok ||
    typeof payload !== 'object' ||
    payload === null ||
    (payload as { success?: boolean }).success !== true
  ) {
    const errorPayload = payload as {
      error?: { message?: string; details?: string[] };
    };
    throw new ApiError(
      errorPayload.error?.message ?? 'Не удалось выполнить запрос.',
      response.status,
      errorPayload.error?.details,
    );
  }

  return payload as T;
}

export function getSchedule(
  filters: ScheduleFilters,
  signal?: AbortSignal,
): Promise<ScheduleApiResponse> {
  return request<ScheduleApiResponse>(
    `/schedule/filter${buildQuery(filters)}`,
    { signal },
  );
}

export function sendChatMessage(
  message: string,
  signal?: AbortSignal,
): Promise<ChatApiResponse> {
  return request<ChatApiResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
    signal,
  });
}
