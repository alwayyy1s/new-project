import { createRouter, createWebHistory } from 'vue-router'

import Workspace from '../views/Workspace.vue'
import Workcontent from '../components/workcontent.vue'
import Logicflow from '../components/logicflow.vue'
import Newflow from '../components/new_flow.vue'
import LLM from '../views/LLM.vue'
import Resultflow from '../components/result_flow/result_flow.vue'
import WorkflowForm from '../components/result_flow/WorkflowForm.vue'
import { useWorkflowStore } from '@/stores/counter'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
   
    {
      path:'/chat',
      component: LLM,
    },
    {
      path: '/workspace',
      component:Workspace ,
      children:[
        {
          path: 'workflow/:title',
          component: Logicflow,

        },
        {
          path: '',
          component: Workcontent,
        },
        {
          path:'addflow',
          component:Newflow
        }
      ]
    },
    {
      path:'/resultflow',
      component:Resultflow,
     
    },
  ]
})

export default router
