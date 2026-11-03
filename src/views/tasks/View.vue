<script setup lang="ts">
  import TasksList from '@/components/tasks/tasks-list/TasksList.vue';

  const { taskId, status, search } = defineProps<{
    taskId?: number,
    status?: string,
    search?: string
  }>();
</script>

<template>
  <div class="p-2 w-full lg:w-3/4 xl:w-1/2 lg:mx-auto">
    <TasksList :task-id="taskId"
      :status="status"
      :search="search" />
  </div>
</template>