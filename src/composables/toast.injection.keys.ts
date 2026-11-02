import type { InjectionKey } from 'vue';
import type { ToastProvide } from '@/types/toast.ts';

export const toastInjectionKey = Symbol() as InjectionKey<ToastProvide>;