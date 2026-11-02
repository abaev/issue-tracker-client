<script setup lang="ts">
  import * as tasksApi from '@/services/tasks.api.ts';
  import type { Task, FindTaskInput } from '@/types/tasks.ts';
  import { ref, watchEffect } from 'vue';
  import { ApiError } from '@/errors/errors.ts';
  import { taskStatusSchema } from '@/schemas/tasks.schemas.ts';
  import { useToast } from '@/composables/useToast.ts';
  import TaskCard from '@/components/tasks/tasks-list/TaskCard.vue';

  const { taskId, status, search } = defineProps<{
    taskId?: number,
    status?: string,
    search?: string
  }>();

  const tasks = ref<Task[]>([]);
  const loading = ref<boolean>(false);

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
        message
      });
    
    } finally {
      loading.value = false;
    }
  }

  watchEffect(() => {
    toastApi.deleteToast();

    let params: FindTaskInput = { id: taskId, search };

    if(status) {
      const parsed = taskStatusSchema.safeParse(status);

      if(parsed.error) {
        toastApi.createToast({
          type: 'error',
          message: 'Недопустимый статус задачи'
        });

        return;
      
      } else params.status = parsed.data;
    }

    getTasks(params);
  });
</script>

<template>
  <div class="p-2 w-full lg:w-3/4 xl:w-1/2 lg:mx-auto">
    <!-- Фильтры -->
    <div class="card card-border bg-white mb-2">
      <div class="card-body">
        <div class="grid grid-cols-12 gap-4 items-stretch">
          <div class="col-span-12 md:col-span-6 flex flex-1">
            <div class="flex flex-1">
              <input type="text" class="input flex flex-1"/>
            </div>
          </div>

          <div class="col-span-12 md:col-span-6 flex flex-1">
            <div class="flex flex-1">
              <input type="text" class="input flex flex-1"/>
            </div>
          </div>

          <div>
            <button class="btn">
              <span v-if="loading"
                class="loading loading-spinner">
              </span>
              Найти
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="tasks.length > 0"
      class="grid grid-cols-12 gap-4">
      <div v-for="t in tasks" :key="t.id"
        class="col-span-12 md:col-span-6 items-stretch">
        <TaskCard :task="t"/>
      </div>
    </div>

    <div v-else="!loading"
      class="card card-border bg-white">
      <div class="card-body">Задачи не найдены</div>
    </div>
  </div>  
</template>