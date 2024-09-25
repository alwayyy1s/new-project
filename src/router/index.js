import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Workspace from '../views/Workspace.vue'
import Workcontent from '../components/workcontent.vue'
import Logicflow from '../components/logicflow.vue'
import LLM from '../views/LLM.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component:Workspace
    },
    {
      path: '/home',
      component: Home,
    },
    {
      path:'/chat',
      component: LLM,
    },
    {
      path: '/workspace',
      component:Workspace ,
      children:[
        {
          path: 'workflow/:id',
          component: Logicflow,

        },
        {
          path: '',
          component: Workcontent,
        },]
    },
    {
      path: '/workspace',
      component:Workspace ,
      children:[
        {
          path: 'workflow/:id',
          component: Logicflow,

        },
        {
          path: '',
          component: Workcontent,
        },
        {
          path:'addflow',
          component:Logicflow
        }
      ]
    },
  ]
})

export default router
