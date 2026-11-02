<script setup lang="ts">
  import TasksList from '@/components/tasks/tasks-list/TasksList.vue';

  const { taskId, status, search } = defineProps<{
    taskId?: number,
    status?: string,
    search?: string
  }>();
</script>

<template>
  <TasksList :task-id="taskId"
    :status="status"
    :search="search" />
</template>