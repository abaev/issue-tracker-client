<script setup lang="ts">
  import * as tasksApi from '@/services/tasks.api.ts';
  import type { Task, UpdateTaskInput } from '@/types/tasks.ts';
  import { ref, watchEffect, computed } from 'vue';
  import { ApiError } from '@/errors/errors.ts';
  import { taskIdSchema, updateTaskInputSchema } from '@/schemas/tasks.schemas.ts';
  import { useToast } from '@/composables/useToast.ts';
  import { fieldErrors } from '@/utils/field.errors';

  const { taskId } = defineProps<{
    taskId?: number
  }>();

  const task = ref<Task>();
  const loading = ref<boolean>(false);
  const updating = ref<boolean>(false);
  const updateTaskInput = ref<UpdateTaskInput>({
    title: '',
    description: ''
  });

  const taskStatusOptions = [
    { status: 'open', text: 'Открытые' },
    { status: 'in_progress', text: 'В работе' },
    { status: 'done', text: 'Завершенные' }
  ];

  const toastApi = useToast();

  async function getTasks(id: number): Promise<void> {
    try {
      loading.value = true;

      task.value = (await tasksApi.getTasks({ id })).tasks[0];

      if(!task.value) {
        toastApi.createToast({
          type: 'error',
          message: 'Задача не найдена',
          close: true
        });

        return;
      }

      updateTaskInput.value.title = task.value.title;
      updateTaskInput.value.description = task.value.description;
      updateTaskInput.value.status = task.value.status;

    } catch (error) {
      console.error(error);

      let message = 'Ошибка получения задач';

      if(error instanceof ApiError) message = error.message;

      toastApi.createToast({
        type: 'error',
        message,
        close: true
      });
    
    } finally {
      loading.value = false;
    }
  }

  async function updateTask() {
    try {
      updating.value = true;

      await tasksApi.upadteTask({
        id: taskId as number,
        updateTaskInput: updateTaskInput.value
      });

    } catch (error) {
      console.error(error);

      let message = 'Ошибка сохранения';

      if(error instanceof ApiError) message = error.message;

      toastApi.createToast({
        type: 'error',
        message,
        close: true
      });

    } finally {
      updating.value = false;
    }
  }

  watchEffect(() => {
    const parsed = taskIdSchema.safeParse(taskId);

    if(parsed.error) {
      toastApi.createToast({
        type: 'error',
        message: 'Недопустимый id задачи',
        close: true
      });

      return;
    }

    getTasks(parsed.data);
  });

  const inputFieldsErrors = computed(() => {
    const error = updateTaskInputSchema.safeParse(updateTaskInput.value).error;

    if(error) {
      return fieldErrors(error);
    }

    return [];
  });
</script>

<template>
  <div class="flex justify-center">
    <div class="w-full md:w-1/2">
      <div class="card card-border bg-white mb-2">
        <div class="card-body">
          <div class="block">
            <template v-if="task">
              <fieldset class="fieldset">
                <label class="label" for="title">Название</label>
                <input v-model="updateTaskInput.title"
                  id="title"
                  type="text"
                  :class="{ 'input-error': inputFieldsErrors.some(e => e.field === 'title') }"
                  class="input flex-1 w-full" />
              </fieldset>

              <fieldset class="fieldset">
                <label class="label" for="description">Описание</label>
                <textarea v-model="updateTaskInput.description"
                  id="description"
                  type="text"
                  :class="{ 'textarea-error': inputFieldsErrors.some(e => e.field === 'description') }"
                  class="textarea flex-1 w-full">
                </textarea>
              </fieldset>

              <fieldset class="fieldset">
                <label class="label" for="status">Статус</label>
                <select v-model="updateTaskInput.status"
                  id="status"
                  :class="{ 'select-error': inputFieldsErrors.some(e => e.field === 'status') }"
                  class="select flex-1 w-full">
                  <option v-for="o in taskStatusOptions" :value="o.status" :key="o.status">
                    {{ o.text }}
                  </option>
                </select>
              </fieldset>

              <div class="mt-2">
                <button class="btn"
                  :disabled="updating"
                  @click="updateTask">
                  <span v-if="updating"
                    class="loading loading-spinner">
                  </span>
                  Сохранить
                </button>
              </div>
            </template> 

            <div class="mt-6">
              <RouterLink :to="{ name: 'view' }">
                <a class="link link-hover">Список задач</a>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>