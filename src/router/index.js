import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/login'
import admin from '@/components/base/admin'

import enterprise from "@/pages/enterprise"
import enterpriselist from "@/pages/enterprise/list"
import user from "@/pages/enterprise/user"

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'admin',
      /* redirect: '/recipe', */
      component: admin,
      children: [{
        path: "enterprise",
        name: "enterprise",
        component: enterprise,
        children: [{
          path: '/enterprise/list',
          component: enterpriselist
        }, {
          path: '/enterprise/user',
          component: user
        }, ]
      }, ]
    },

    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
