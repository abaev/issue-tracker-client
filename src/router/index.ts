import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'view',
      path: '/view/:taskId?',
      component: () => import('@/views/tasks/View.vue'),
      props: route => ({
        taskId: typeof route.params.taskId === 'string' ? Number(route.params.taskId) || undefined : undefined,
        status: route.query.status,
        search: route.query.search
      })
    },
    {
      name: 'update',
      path: '/update/:taskId?',
      component: () => import('@/views/tasks/Update.vue'),
      props: route => ({
        taskId: typeof route.params.taskId === 'string' ? Number(route.params.taskId) || undefined : undefined
      })
    },
    {
      name: 'create',
      path: '/create',
      component: () => import('@/views/tasks/Create.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/view'
    }
  ],
});

export default router;
