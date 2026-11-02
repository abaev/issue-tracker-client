import { axiosInst } from '@/services/axios.ts';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { FindTaskInput } from '@/types/tasks.ts';
import type { Task } from '@/types/tasks.ts';
import { tasksObjectSchema } from '@/schemas/tasks.schemas.ts';
import { ApiError } from '@/errors/errors.ts';
import { fieldErrors } from '@/utils/field.errors.ts';

// Получение задач
export async function getTasks(options: FindTaskInput = {}): Promise<{ tasks: Task[] }> {
  let requestConfig: AxiosRequestConfig = {};

  if(options.status !== undefined) {
    requestConfig = {
      params: { status: options.status }
    }
  }

  if(options.search !== undefined) {
    requestConfig = {
      ...requestConfig,
      params: { search: options.search }
    }
  }

  const response: AxiosResponse<unknown> = await axiosInst.get(
    options.id ? `/tasks/${options.id}` : '/tasks',
    requestConfig
  );

  const parsed = tasksObjectSchema.safeParse(response.data);

  if(parsed.error) {
    throw new ApiError('Ошибка ответа API', { details: fieldErrors(parsed.error) });
  }

  return parsed.data;
}