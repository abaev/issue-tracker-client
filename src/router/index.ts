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
      path: '/:pathMatch(.*)*',
      redirect: '/view'
    }
  ],
});

export default router;
