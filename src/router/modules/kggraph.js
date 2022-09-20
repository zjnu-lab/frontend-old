/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'






const kggraphRouter = {
    
  path: '/kggraph',
  //component: Layout,
  component: () => import('@/views/components-demo/temp'),
  //redirect: 'noRedirect',
  name: 'KgGraph',
  meta: {
    title: 'KgGraph',
   
  },
  
  children: [

    {
        path: 'index',
        component: () => import('@/views/components-demo/kggraph'),
        name: 'KgGraph',
        meta: { title: 'KgGraph' }
    },
    
    {
        path: 'node/:id',
        component: () => import('@/views/components-demo/node'),
        name: 'node',
        meta: { title: 'node' },
        hidden:true
    }
    
  ]
  
  
    }

export default kggraphRouter
