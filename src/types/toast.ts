import type { Ref } from 'vue';

export interface Toast {
  type: ToastType,
  message: string,
  duration?: number /* мс, бесконечно если undefined */
}

export interface ToastProvide {
  createToast: (toast: Toast) => Ref<Toast>,
  deleteToast: () => void
}

export type ToastType = 'info' | 'success' | 'error';