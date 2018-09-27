import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/login'
import admin from '@/components/base/admin'
import sys from '@/pages/sys'
/* import enterprise from "@/pages/enterprise"
import enterpriselist from "@/pages/enterprise/list" */
import user from "@/pages/sys/user"
import enterprise from "@/pages/enterprise/"
import enterpriseList from "@/pages/enterprise/list"

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'admin',
      component: admin,
      children: [{
          path: "sys",
          name: "sys",
          component: sys,
          children: [{
            path: "/sys/user",
            component: user
          }]
        },
        {
          name: "enterprise",
          path: "enterprise",
          component: enterprise,
          children: [{
            path: "/enterprise/list",
            component: enterpriseList
          }]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
