<!-- https://github.com/ChronicStone/VTEST-VUE-COMPOSITION-API -->
 
<script setup lang="ts">
  import { ref, provide, shallowRef, onMounted, onUnmounted, toValue } from 'vue';
  import type { Ref } from 'vue';
  import type { Toast } from '@/types/toast.ts';
  import { toastInjectionKey } from '@/composables/toast.injection.keys.ts';
  import ToastComponent from '@/components/toast/Toast.vue';
  
  const toasts = shallowRef<{
    toast: Ref<Toast>,
    addDate: number,
    id: number
  }[]>([]);

  let nextToastId = 0;

  function createToast(toast: Toast): Ref<Toast> {
    const newToast = ref<Toast>(toast);
    toasts.value = [
      ...toasts.value,
      {
        toast: newToast,
        addDate: Date.now(),
        id: nextToastId++
      }
    ];

    return newToast;
  }

  function deleteToast() {
    toasts.value = [];
  }

  let processToastsIntID: number;

  provide(toastInjectionKey, {
    createToast,
    deleteToast
  });

  onMounted(() => {
    processToastsIntID = setInterval(
      () => {
        // Удаление истекших тостов
        const newToasts = toasts.value.filter(t => t.toast.value.duration === undefined || Date.now() - t.addDate < t.toast.value.duration);

        if(newToasts.length !== toasts.value.length) toasts.value = newToasts;
      },
      100
    );
  });

  onUnmounted(() => clearInterval(processToastsIntID));
</script>

<template>
  <div>
    <slot></slot>

    <div class="toast toast-top toast-end max-h-64 overflow-y-auto scrollbar-none">
      <ToastComponent v-for="(t, i) in toasts" :key="t.id"
        :toast="toValue(t.toast)" />
    </div>
  </div>
</template>