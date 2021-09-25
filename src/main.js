import Vue from 'vue'
import Vuesax from 'vuesax'

import Vuelidate from 'vuelidate'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import 'material-icons/iconfont/material-icons.css';
// Vuex Store
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


import store from './store/store'
import moment from 'moment'

// Theme Configurations
import 'prismjs'
import 'prismjs/themes/prism.css'
import VsPrism from './components/prism/VsPrism.vue';
Vue.component(VsPrism.name, VsPrism);
Vue.use(Vuelidate)

Vue.axios.defaults.baseURL = 'http://localhost:3000/api/'

//Vue.http.headers.common['Access-Control-Allow-Origin'] = true
//Vue.http.headers.common['Access-Control-Allow-Origin'] = '*'
// Vue Router
import router from './router'
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(Vuesax, {
  theme: {
    colors: {
      primary: '#fb9678',
    }
  }
})

Vue.filter('formatDate', function(value) {
  if (value) {
      return moment(String(value)).format('DD/MM/YYYY à h:m')
  }
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
import '@/assets/scss/style.scss'