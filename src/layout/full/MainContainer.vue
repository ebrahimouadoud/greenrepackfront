<template>
  <div class="main-wrapper">
    <!---Navigation-->
    <Navbar
      :cardCount="cardCount"
      :topbarColor="topbarColor"
      :logo="require('@/assets/images/logo/logo-light-icon.png')"
      :title="logotitle"
    />
    <!---Sidebar-->
    <SideBar parent=".main-wrapper" :sidebarLinks="sidebarLinks" />
    <!---Page Container-->
    <div class="main-container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from "@/layout/full/header/Navbar.vue";
import SideBar from "@/layout/full/sidebar/SideBar.vue";
import sidebarLinks from "@/layout/full/sidebar/sidebarlinks.js";
import axios from 'axios'
import auth from '../../auth'
/* eslint-disable */
export default {
  name: "MainContainer",
  components: {
    Navbar,
    SideBar
  },
  data: () => ({
    topbarColor: "#2a3b73",
    logotitle: "Green Repack",
    sidebarLinks: sidebarLinks,
    cardCount: 0,
    auth: auth
  }),
  mounted(){
    if( ! this.auth.isAdminOrUser() ){
      this.loadMyCart()
    }
  },
  methods: {
    loadMyCart(){
      console.log( 'MAIN  this.$parent.loadMyCart()' )
      axios.get('card/me')
        .then(res=>{
          console.log( ' CARD RES  :: ', res.data)
          if(res.data.rows[0]){
            this.cardCount = res.data.rows[0].produits.length
          }else{
            this.cardCount = 0
          }
          
        })
    },
  }
};
</script>