import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from './store'


Vue.use(BootstrapVue)
Vue.config.productionTip = false

Vue.use(Vuex);
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
