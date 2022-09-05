import Vue from 'vue'
import VueRouter from 'vue-router'

import Esign from '../views/Esign.vue';
import Fabric from '../views/Fabric01.vue';
import Pdfview from '../views/PdfView.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Esign',
    component: Esign
  },
  {
    path: '/fabric',
    name: 'Fabric',
    component: Fabric
  },
  {
    path: '/pdfview',
    name: 'PdfView',
    component: Pdfview
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
