<template>
  <header class="gridx">
    <vs-navbar
      v-model="indexActive"
      :color="topbarColor"
      class="topnavbar"
      text-color="rgba(255,255,255,0.7)"
      active-text-color="rgba(255,255,255,1)"
    >
      <!---
      Template logo
      -->
      <div slot="title" class="themelogo">
        <img :src="logo" v-if="logo" alt="Dashboard" />
        <span class="logo-text" v-if="title">{{ title }}</span>
      </div>
      <!---
      Mobile toggle
      -->
      <div slot="title">
        <div class="hiddenDesktop cursor-pointer" @click.stop="activeSidebar">
          <vs-icon icon="menu"></vs-icon>
        </div>
      </div>
      <!---
      Craete new dd
      -->
      

      <vs-spacer></vs-spacer>
      <!---
      Craete new dd
      -->
      <vs-dropdown vs-trigger-click left class="cursor-pointer pr-2 pl-2 ml-1 mr-1">
        <a class="text-white-dark mr-4" >
          <vs-icon icon="shopping_cart"></vs-icon>
          <div class="cart_count mr-4"><span> {{cardCount}} </span></div>
        </a>
        <vs-dropdown-menu class="topbar-dd">
          <vs-dropdown-item href="#/mycard">Consulter</vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>
      <!---
      Craete new dd
      -->
      <vs-dropdown vs-trigger-click left class="cursor-pointer pr-2 pl-2 ml-1 mr-md-3">
        <a class="text-white-dark user-image" href="#">
          <img src="@/assets/images/users/1.jpg" alt="User" />
        </a>
        <vs-dropdown-menu class="topbar-dd">
          <vs-dropdown-item>
            <vs-icon icon="person_outline" class="mr-1"></vs-icon>Mon profile
          </vs-dropdown-item>
          <vs-dropdown-item>
            <vs-icon icon="history" class="mr-1"></vs-icon>Mes commandes
          </vs-dropdown-item>
          <hr class="mb-1" />
          <vs-dropdown-item @click="logout">
            <vs-icon icon="power_off" class="mr-1"></vs-icon>Déconnection
          </vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>
    </vs-navbar>
  </header>
</template>

<script>
import auth from '../../../auth'
import axios from 'axios'
/* eslint-disable */ 
export default {
  name: "Navbar",
  props: {
    topbarColor: {
      type: String,
      default: "#4F5467"
    },
    title: {
      type: String
    },
    logo: {
      type: String
    },
    cardCount:{
      type : Number
    }
  },
  data: () => ({
    indexActive: 0,
    showToggle: false,
    search: "",
    auth: auth
  }),
  mounted(){
  },
  methods: {
    //This is for sidebar trigger in mobile
    activeSidebar() {
      this.$store.commit("IS_SIDEBAR_ACTIVE", true);
    },
    logout(){
      console.log(' LOGOUT ')
      this.auth.logout()
    }
  }
};
</script>

<style>


.cart_count {
    position: absolute;
    bottom: -1px;
    right: -14px;
    width: 23px;
    height: 23px;
    background: #0e8ce4;
    border-radius: 50%;
    text-align: center
}

.cart_count span {
    display: block;
    line-height: 23px;
    font-size: 12px;
    color: #FFFFFF;
    -webkit-transform: translateY(1px);
    -moz-transform: translateY(1px);
    -ms-transform: translateY(1px);
    -o-transform: translateY(1px);
    transform: translateY(1px)
}

.cart_content {
    margin-left: 28px
}





@media only screen and (max-width: 575px) {

    .cart_content {
        margin-left: 18px
    }

    .cart_count {
        width: 21px;
        height: 21px
    }

    .cart_count span {
        line-height: 21px
    }

   
}
</style>