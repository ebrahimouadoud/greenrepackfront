<template>

   <div id="parentx">
    <vs-sidebar v-if="auth.isAdminOrManager()" default-index="1" :parent="parent" :hiddenBackground="doNotClose" color="primary" class="sidebarx" spacer v-model="isSidebarActive" :click-not-close="doNotClose" >
        <div class="header-sidebar text-center" slot="header">
            <vs-avatar size="70px" :src="require('@/assets/images/users/1.jpg')"/>
            <h4> {{ auth.user.firstName }} {{ auth.user.lastName }} </h4>
              <small>{{ auth.user.email }}</small>
            
        </div>
        <template >
            <vs-sidebar-item icon="people" :to="'/users'" >
              <span class="hide-in-minisidebar">     Utilisateurs</span>
            </vs-sidebar-item>
        </template>
        <template >
            <vs-sidebar-item icon="shop" :to="'/resalls'" >
              <span class="hide-in-minisidebar">Reventes</span>
            </vs-sidebar-item>
        </template>
        <template >
            <vs-sidebar-item icon="inventory" :to="'/products'" >
              <span class="hide-in-minisidebar">Produits</span>
            </vs-sidebar-item>
        </template>
        <template >
            <vs-sidebar-item icon="list" :to="'/manageorders'" >
              <span class="hide-in-minisidebar">Commands</span>
            </vs-sidebar-item>
        </template>
        <template >
            <vs-sidebar-item icon="book" :to="'/catalogue'" >
              <span class="hide-in-minisidebar">Catalogue</span>
            </vs-sidebar-item>
        </template>
        <template >
            <vs-sidebar-item icon="apartment" :to="'/warehouse'" >
              <span class="hide-in-minisidebar">Entrepots</span>
            </vs-sidebar-item>
        </template>

    </vs-sidebar>
    <vs-sidebar v-else default-index="1" :parent="parent" :hiddenBackground="doNotClose" color="primary" class="sidebarx" spacer v-model="isSidebarActive" :click-not-close="doNotClose" >
        <div class="header-sidebar text-center" slot="header">
            <vs-avatar size="70px" :src="require('@/assets/images/users/1.jpg')"/>
            <h4> {{ auth.user.firstName }} {{ auth.user.lastName }} </h4>
              <small>{{ auth.user.email }}</small>
            
        </div>
        <template >
            <vs-sidebar-item icon="autorenew" :to="'/myresalls'" >
              <span class="hide-in-minisidebar"> Mes reventes </span>
            </vs-sidebar-item>
        </template>
        <template >
            <vs-sidebar-item icon="storefront" :to="'/store'" >
              <span class="hide-in-minisidebar">Boutique</span>
            </vs-sidebar-item>
        </template>
        <template >
            <vs-sidebar-item icon="list" :to="'/myorders'" >
              <span class="hide-in-minisidebar">Mes commandes</span>
            </vs-sidebar-item>
        </template>
        <template >
            <vs-sidebar-item icon=""  >
              <span class="hide-in-minisidebar"></span>
            </vs-sidebar-item>
        </template>

    </vs-sidebar>
  </div>


</template>

<script>
import auth from '../../../auth'

export default {
  name: "SideBar",
  props: {
    parent: {
      type: String
    },
    sidebarLinks: {
      type: Array,
      required: true
    },
    index: {
      default: null,
      type: [String, Number]
    }
  },
  data: () => ({
    auth: auth,
    doNotClose: false,
    windowWidth: window.innerWidth
  }),
  computed: {
    //This is for mobile trigger
    isSidebarActive: {
      get() {
        return this.$store.state.isSidebarActive;
      },
      set(val) {
        this.$store.commit("IS_SIDEBAR_ACTIVE", val);
      }
    }
  },
  watch: {},
  methods: {
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebar();
    },
    setSidebar() {
      if (this.windowWidth < 1170) {
        this.$store.commit("IS_SIDEBAR_ACTIVE", false);
        this.doNotClose = false;
      } else {
        this.$store.commit("IS_SIDEBAR_ACTIVE", true);
        this.doNotClose = true;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.setSidebar();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
    this.setSidebar();
  }
};
</script>