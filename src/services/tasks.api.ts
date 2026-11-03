import { axiosInst } from '@/services/axios.ts';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Task, FindTaskInput, UpdateTaskInput } from '@/types/tasks.ts';
import { tasksObjectSchema, taskObjectSchema } from '@/schemas/tasks.schemas.ts';
import { ApiError } from '@/errors/errors.ts';
import { fieldErrors } from '@/utils/field.errors.ts';

// Получение задач
export async function getTasks(options: FindTaskInput = {}): Promise<{ tasks: Task[] }> {
  let requestConfig: AxiosRequestConfig = {};

  if(options.status !== undefined) {
    requestConfig.params = { status: options.status };
  }

  if(options.search !== undefined) {
    requestConfig.params = {
      ...requestConfig.params,
      search: encodeURIComponent(options.search)
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

export async function deleteTask({ id }: { id: number }): Promise<void> {
  await axiosInst.delete(`/tasks/${id}`);
}

export async function upadteTask({ id, updateTaskInput }: { id: number, updateTaskInput: UpdateTaskInput }): Promise<{ task: Task }> {
  const response: AxiosResponse<unknown> = await axiosInst.patch(
    `/tasks/${id}`,
    updateTaskInput
  );

  const parsed = taskObjectSchema.safeParse(response.data);

  if(parsed.error) {
    throw new ApiError('Ошибка ответа API', { details: fieldErrors(parsed.error) });
  }

  return parsed.data;
}