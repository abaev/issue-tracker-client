<script setup lang="ts">
  import UpdateTask from '@/components/tasks/update-task/UpdateTask.vue';

  const { taskId } = defineProps<{
    taskId?: number
  }>();
</script>

<template>
  <div class="p-2 w-full lg:w-3/4 xl:w-1/2 lg:mx-auto">
    <UpdateTask :task-id="taskId"/>
  </div>
</template>