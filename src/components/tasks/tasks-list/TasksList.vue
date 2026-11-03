<script setup lang="ts">
  import * as tasksApi from '@/services/tasks.api.ts';
  import type { Task, FindTaskInput } from '@/types/tasks.ts';
  import { ref, watchEffect } from 'vue';
  import { ApiError } from '@/errors/errors.ts';
  import { findTaskInputSchema } from '@/schemas/tasks.schemas.ts';
  import { useToast } from '@/composables/useToast.ts';
  import TaskCard from '@/components/tasks/tasks-list/TaskCard.vue';
  import { useRouter } from 'vue-router';
  import { fieldErrors } from '@/utils/field.errors';

  const { taskId, status, search } = defineProps<{
    taskId?: number,
    status?: string,
    search?: string
  }>();

  const tasks = ref<Task[]>([]);
  const loading = ref<boolean>(false);
  const findTaskInput = ref<FindTaskInput>({
    search: ''
  });

  const taskStatusOptions = [
    { status: undefined, text: 'Все'},
    { status: 'open', text: 'Открытые' },
    { status: 'in_progress', text: 'В работе' },
    { status: 'done', text: 'Завершенные' }
  ];

  const router = useRouter();

  const toastApi = useToast();

  async function getTasks(options: FindTaskInput = {}): Promise<void> {
    try {
      loading.value = true;

      tasks.value = (await tasksApi.getTasks(options)).tasks;

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

  watchEffect(() => {
    const getTaskParams: any = {};

    if(taskId !== undefined) getTaskParams.id = taskId;
    if(search !== undefined) getTaskParams.search = search;
    if(status !== undefined) getTaskParams.status = status;

    const parsed = findTaskInputSchema.safeParse(getTaskParams);

    if(parsed.error) {
      toastApi.createToast({
        type: 'error',
        message: 'Недопустимые параметры',
        close: true
      });

      if(fieldErrors(parsed.error).some(e => e.field === 'status')) findTaskInput.value.status = undefined;

      return;
    }

    findTaskInput.value.status = parsed.data.status;

    findTaskInput.value.search = search;

    getTasks(parsed.data);
  });

  function findClickHandler() {
    let query: Record<string, string> = {};

    if(typeof findTaskInput.value.search === 'string') query.search = findTaskInput.value.search;

    if(findTaskInput.value.status) query.status = findTaskInput.value.status;

    router.push({
      name: 'view',
      query
    });
  }
</script>

<template>
  <div class="w-full">
    <!-- Фильтры -->
    <div class="card card-border bg-white mb-2">
      <div class="card-body">
        <div class="grid grid-cols-12 gap-4 items-stretch">
          <div class="col-span-12 md:col-span-6 flex flex-1">
            <div class="flex flex-1">
              <input v-model="findTaskInput.search"
                type="text"
                placeholder="Поиск по названию"
                class="input flex flex-1" />
            </div>
          </div>

          <div class="col-span-12 md:col-span-6 flex flex-1">
            <div class="flex flex-1">
              <select v-model="findTaskInput.status"
                placeholder="Статус"
                class="select flex flex-1">
                <option v-for="o in taskStatusOptions" :value="o.status" :key="o.status">
                  {{ o.text }}
                </option>
              </select>
            </div>
          </div>

          <div class="col-span-12 flex justify-between items-center">
            <button class="btn"
              :disabled="loading"
              @click="findClickHandler">
              <span v-if="loading"
                class="loading loading-spinner">
              </span>
              Найти
            </button>

            <RouterLink :to="{ name: 'create' }"
              class="link link-hover">
              Создать задачу
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="tasks.length > 0"
      class="grid grid-cols-12 gap-4">
      <div v-for="t in tasks" :key="t.id"
        class="col-span-12 md:col-span-6 items-stretch">
        <TaskCard :task="t"
          @delete-success="getTasks({ ...findTaskInput })" />
      </div>
    </div>

    <div v-else-if="!loading"
      class="card card-border bg-white">
      <div class="card-body">Задачи не найдены</div>
    </div>
  </div>  
</template>