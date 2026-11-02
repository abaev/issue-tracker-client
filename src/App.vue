<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import ToastProvider from '@/components/toast/ToastProvider.vue';
</script>

<template>
  <ToastProvider>
    <div class="min-h-dvh flex flex-col bg-gray-200">
      <RouterView />
    </div>
  </ToastProvider>  
</template>