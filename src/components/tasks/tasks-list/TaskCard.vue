<script setup lang="ts">
  import type { Task, TaskStatus } from '@/types/tasks.ts';
  import { ref } from 'vue';
  import * as tasksApi from '@/services/tasks.api.ts';
  import { useToast } from '@/composables/useToast.ts';

  const { task } = defineProps<{ task: Task }>();
  const deleting = ref<boolean>(false);
  const toastApi = useToast();

  const emit = defineEmits<{
    'delete-success': [{ task: Task }]
  }>();

  const taskStatus: Record<TaskStatus, string> = {
    open: 'Открыта',
    in_progress: 'В работе',
    done: 'Завершена'
  };

  async function deleteTask() {
    try {
      deleting.value = true;

      await tasksApi.deleteTask({ id: task.id });

      emit('delete-success', { task });

    } catch (error) {
      toastApi.createToast({
        type: 'error',
        message: 'Ошибка удаления',
        close: true
      });

    } finally {
      deleting.value = false;
    }
  }
</script>

<template>
  <div class="card card-border bg-white">
    <div class="card-body">
      <div class="flex flex-col">
        <div class="text-xs text-end">{{ taskStatus[task.status] }}</div>

        <div class="text-lg">{{ task.title }}</div>
        
        <div v-if="task.description">{{ task.description }}</div>

        <div class="mt-4">
          <RouterLink :to="{
              name: 'update',
              params: { taskId: task.id }
            }">
            <button class="btn mr-4">
              Редактировать 
            </button>
          </RouterLink>

          <button class="btn"
            :disabled="deleting"
            @click="deleteTask">
            <span v-if="deleting"
              class="loading loading-spinner">
            </span>
            Удалить
          </button>
        </div>
      </div>
    </div>  
  </div>  
</template>