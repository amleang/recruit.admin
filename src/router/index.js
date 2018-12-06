import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/login'
import admin from '@/components/base/admin'
import home from '@/pages/home'
import sys from '@/pages/sys'
/* import enterprise from "@/pages/enterprise"
import enterpriselist from "@/pages/enterprise/list" */
import sysUser from "@/pages/sys/user"
import sysBase from "@/pages/sys/base"
import sysWxuser from "@/pages/sys/wxuser"
import enterprise from "@/pages/enterprise/"
import enterpriseList from "@/pages/enterprise/list"
import recruit from "@/pages/recruit"
import recruitList from "@/pages/recruit/list"
import recruitCorrection from "@/pages/recruit/correction"
import crm from "@/pages/crm"
import crmwvisit from "@/pages/crm/wvisit"
import crmavisit from "@/pages/crm/avisit"
import crmwentry from "@/pages/crm/wentry"
import crmcashback from "@/pages/crm/cashback"
import crmend from "@/pages/crm/end"
import crmcashbacklist from "@/pages/crm/cashbacklist"
import crmrecommend from "@/pages/crm/recommend"
import { homedir } from 'os';
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'admin',
    component: admin,
    redirect:"/home",
    children: [
      {
        path:"home",
        name:"home",
        component:home,
      },
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
        }, {
          path: "/sys/wxuser",
          component: sysWxuser
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

      }, {
        name: "crm",
        path: "crm",
        component: crm,
        redirect: "/crm/wvisit",
        children: [
          {
            path: "/crm/wvisit",
            component: crmwvisit
          }, {
            path: "/crm/avisit",
            component: crmavisit
          }, {
            path: "/crm/wentry",
            component: crmwentry
          }, {
            path: "/crm/cashback",
            component: crmcashback
          }, {
            path: "/crm/end",
            component: crmend
          }, {
            path: "/crm/cashbacklist",
            component: crmcashbacklist
          }, {
            path: "/crm/recommend",
            component: crmrecommend
          }
        ]
      }
      // {
      //   name: "enterprise",
      //   path: "enterprise",
      //   component: enterprise,
      //   redirect: "/enterprise/list",
      //   children: [{
      //     path: "/enterprise/list",
      //     component: enterpriseList
      //   }
      //   ]
      // }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
  ]
})
