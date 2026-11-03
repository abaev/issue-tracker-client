<script setup lang="ts">
  import { computed  } from 'vue';
  import type { Toast, ToastType } from '@/types/toast.ts';
  import { XMarkIcon } from '@heroicons/vue/24/solid';

  const { toast } = defineProps<{ toast: Toast }>();
  const emit = defineEmits<{
    close: [Toast]
  }>();

  // Такое решение нужно чтобы Tailwind добавил CSS - имя класса не может быть динамическим,
  // все имена должны быть перечислены в коде (хоть в комментарии)
  const typeClasses: Record<ToastType, string> = {
    info: 'alert-info',
    success: 'alert-success',
    error: 'alert-error'
  };
  const containerClass = computed(() => `alert alert-soft ${typeClasses[toast.type]}`);

  const typeTextClasses: Record<ToastType, string> = {
    info: 'text-info',
    success: 'text-success',
    error: 'text-error'
  };

  const iconClass = computed(() => `size-4 ${typeTextClasses[toast.type]}`);
</script>

<template>
  <div :class="containerClass">
    <span>{{ toast.message }}</span>

    <button class="btn btn-ghost btn-sm"
      @click="emit('close', toast)">
      <XMarkIcon :class="iconClass" />
    </button>
  </div>
</template>