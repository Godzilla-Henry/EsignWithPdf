import Vue from 'vue'
import App from './App.vue'
import vueEsign from 'vue-esign'
import router from './router'


Vue.use(vueEsign);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
