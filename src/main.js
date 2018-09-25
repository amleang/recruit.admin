// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false

//自定义基础模板
import admin from '@/components/base/admin';
Vue.component('base-admin', admin)

import baseQuery from '@/components/tool/baseQuery'
Vue.component('base-query', baseQuery);

import baseTable from '@/components/table/baseTable'
Vue.component('base-table', baseTable);

import http from '@/components/api/http'
Vue.prototype.http = http;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
