<script setup lang="ts">
  import { computed  } from 'vue';
  import type { Toast, ToastType } from '@/types/toast.ts';

  const { toast } = defineProps<{ toast: Toast }>();

  // Такое решение нужно чтобы Tailwind добавил CSS - имя класса не может быть динамическим,
  // все имена должны быть перечислены в коде (хоть в комментарии)
  const typeClasses: Record<ToastType, string> = {
    info: 'alert-info',
    success: 'alert-success',
    error: 'alert-error'
  };

  const containerClass = computed(() => `alert alert-soft ${typeClasses[toast.type]}`);
</script>

<template>
  <div :class="containerClass">
    <span>{{ toast.message }}</span>
  </div>
</template>