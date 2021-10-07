<template>
  <vs-row>
    <vs-col vs-lg="6" vs-xs="12">
      <vs-card>
        <h3 class="mb-1 font-weight-normal">{{totalUsers}}</h3>
        <span class="text-muted">Utilisateurs</span>
        <vs-progress :percent="100" color="success">success</vs-progress>
      </vs-card>
    </vs-col>
    <vs-col vs-lg="6" vs-xs="12">
      <vs-card>
        <h3 class="mb-1 font-weight-normal">{{totalProducts}} </h3>
        <span class="text-muted">Produits gérés</span>
        <vs-progress :percent="100" color="primary">primary</vs-progress>
      </vs-card>
    </vs-col>
    <vs-col vs-lg="12" vs-xs="12">
      <vs-card>
        <h3 class="mb-1 font-weight-normal">{{ totalSales }}</h3>
        <span class="text-muted">Ventes</span>
        <vs-progress :percent="100" color="warning">warning</vs-progress>
      </vs-card>
    </vs-col>
  </vs-row>
</template>
<script>
/* eslint-disable */
import axios from 'axios'
export default {
  name: "States",
  data() {
    return {
      totalUsers: 0,
      totalProducts: 0,
      totalSales: 0,
      totalAssociations: 0
    }
  },
  mounted() {
    axios.get('/users/all' )
            .then( result => {
                
                this.totalUsers = result.data.total
                
            })
    axios.get('/products/all')
      .then( result => {
                this.totalProducts = result.data.Products.length
            })
    axios.get('/orders' )
      .then( result => {
          this.totalSales = result.data.rows.length
          })
  },
  methods:{
    
  }
};
</script>