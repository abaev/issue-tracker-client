<script setup lang="ts">
  import type { Task } from '@/types/tasks.ts';
  import { ref } from 'vue';

  const { task } = defineProps<{ task: Task }>();

  const deleting = ref<boolean>(false);
</script>

<template>
  <div class="card card-border bg-white">
    <div class="card-body">
      <div class="flex flex-col">
        <div class="text-lg">{{ task.title }}</div>
        <div v-if="task.description">{{ task.description }}</div>

        <div class="mt-4">
          <button class="btn mr-4">
            Редактировать 
          </button>

          <button class="btn">
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