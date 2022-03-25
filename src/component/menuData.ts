export default [
  {
    path: '/commander',
    name: '控制台',
    component: '@/component/menu',
    routes:[
      {
        name: '池管理',
        path: '/commander/pool',
        routes:[
          {
            name:'技能池管理',
            path:'/commander/pool/skills',
            component: '@/pages/pool/Skills'
          },
          {
            name:'随机池管理',
            path:'/commander/pool/random',
            component: '@/pages/pool/Random'
          },
        ]
      },
      {
        name: '团管理',
        path: '/commander/group',
        routes:[
          {
            path:'/commander/group/groupManage',
            name: '管理',
            component:'@/pages/group/groupManage'
          },
          {
            path:'/commander/group/groupCurrent',
            name: '团通用设置',
          }
        ]
      },
      {
        name: '团总览',
        path: '/commander/overview',
        routes:[
          {
            path: '/commander/overview/chat',
            name: '消息总览',
            component: '@/component/chat/MsgList',
          },
          {
            path: '/commander/overview/status',
            name: '状态总览',
            component: '@/pages/group/PcOverview',
          },
          {
            path: '/commander/overview/combat',
            name: '战斗轮总览',
            //component: '@/pages/chat',
          },
          {
            path: '/commander/overview/brainMap',
            name: '脑图&备忘信息',
            //component: '@/pages/chat',
          },
        ]
      },
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: '@/pages/login'
  },
  {
    path: '/',
    redirect: '/commander'
  },
  {
    component: '@/pages/error/page404'
  }
];