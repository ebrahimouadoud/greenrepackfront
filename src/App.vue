<template>
  <div id="app">
    <div v-if="!auth.user.authed">
      <login v-if="loginShow"></login>
      <register v-else ></register>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import login from './views/components/Login/Login.vue'
import register from './views/components/Login/Register.vue'
import auth from './auth'
import ThemifyIcon from "vue-themify-icons";

export default {
  name: 'app',
  components: {
    login, register, ThemifyIcon
  },
  data:()=>({
    loginShow: true,
    auth: auth
  }),
  mounted() {
    this.auth.getudata()
  },
  methods: {
    switchToRegister(){
      this.loginShow = false
    }
  }
  
}
</script>