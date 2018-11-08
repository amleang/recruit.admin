import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/login'
import admin from '@/components/base/admin'
import sys from '@/pages/sys'
/* import enterprise from "@/pages/enterprise"
import enterpriselist from "@/pages/enterprise/list" */
import sysUser from "@/pages/sys/user"
import sysBase from "@/pages/sys/base"
import enterprise from "@/pages/enterprise/"
import enterpriseList from "@/pages/enterprise/list"
import recruit from "@/pages/recruit"
import recruitList from "@/pages/recruit/list"
import recruitCorrection from "@/pages/recruit/correction"

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'admin',
    component: admin,
    children: [
      {
        path: "sys",
        name: "sys",
        component: sys,
        redirect: "/sys/user",
        children: [{
          path: "/sys/user",
          component: sysUser
        },
        {
          path: "/sys/base",
          component: sysBase
        }
        ]
      },
      {
        path: "recruit",
        name: "recruit",
        component: recruit,
        redirect: "/recruit/list",
        children: [
          {
            path: "/recruit/list",
            component: recruitList
          }, {
            path: "/recruit/correction",
            component: recruitCorrection
          }
        ]

      },
      /* {
        name: "enterprise",
        path: "enterprise",
        component: enterprise,
        redirect: "/enterprise/list",
        children: [{
          path: "/enterprise/list",
          component: enterpriseList
        }
        ]
      } */
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
  ]
})
