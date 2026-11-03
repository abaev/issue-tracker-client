<script setup lang="ts">
  import * as tasksApi from '@/services/tasks.api.ts';
  import type { Task, CreateTaskInput } from '@/types/tasks.ts';
  import { ref, computed } from 'vue';
  import { ApiError } from '@/errors/errors.ts';
  import { createTaskInputSchema } from '@/schemas/tasks.schemas.ts';
  import { useToast } from '@/composables/useToast.ts';
  import TaskCard from '@/components/tasks/tasks-list/TaskCard.vue';
  import { useRouter } from 'vue-router';
  import { fieldErrors } from '@/utils/field.errors';

  const creating = ref<boolean>(false);
  const createTaskInput = ref<CreateTaskInput>({
    title: '',
    description: ''
  });

  const toastApi = useToast();
  const router = useRouter();

  async function createTask() {
    try {
      creating.value = true;

      await tasksApi.createTask({ createTaskInput: createTaskInput.value });

      router.push({ name: 'view' });

    } catch (error) {
      console.error(error);

      let message = 'Ошибка создания задачи';

      if(error instanceof ApiError) message = error.message;

      toastApi.createToast({
        type: 'error',
        message,
        close: true
      });

    } finally {
      creating.value = false;
    }
  }

  const inputFieldsErrors = computed(() => {
    const error = createTaskInputSchema.safeParse(createTaskInput.value).error;

    if(error) {
      return fieldErrors(error);
    }

    return [];
  });
</script>

<template>
  <div class="flex justify-center">
    <div class="w-full md:w-1/2">
      <div class="card card-border bg-white mb-2">
        <div class="card-body">
          <div class="block">
            <fieldset class="fieldset">
              <label class="label" for="title">Название</label>
              <input v-model="createTaskInput.title"
                id="title"
                type="text"
                :class="{ 'input-error': inputFieldsErrors.some(e => e.field === 'title') }"
                class="input flex-1 w-full" />
            </fieldset>

            <fieldset class="fieldset">
              <label class="label" for="description">Описание</label>
              <textarea v-model="createTaskInput.description"
                id="description"
                type="text"
                :class="{ 'textarea-error': inputFieldsErrors.some(e => e.field === 'description') }"
                class="textarea flex-1 w-full">
              </textarea>
            </fieldset>

            <div class="mt-2">
              <button class="btn"
                :disabled="creating"
                @click="createTask">
                <span v-if="creating"
                  class="loading loading-spinner">
                </span>
                Создать
              </button>
            </div>

            <div class="mt-6">
              <RouterLink :to="{ name: 'view' }">
                <a class="link link-hover">Список задач</a>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>