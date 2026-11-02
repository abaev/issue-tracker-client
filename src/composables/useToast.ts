import { inject } from 'vue';
import { toastInjectionKey } from '@/composables/toast.injection.keys.ts';
import type { ToastProvide } from '@/types/toast.ts';

export function useToast() {
  const toastApi = inject<ToastProvide>(toastInjectionKey);

  if(toastApi === undefined) throw new Error('Provide/inject error');
  
  return toastApi;
}