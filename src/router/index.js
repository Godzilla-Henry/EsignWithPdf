import Vue from 'vue'
import VueRouter from 'vue-router'

import Pdfview01 from '../views/PdfView01.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Esign',
    component: Pdfview01
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
