<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Catalogue'"
                :ope="'Gestion'" 
                :showbtn="false">
            </brc>
        </div>

        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Catalogue des types, marques, et models des produits</h4>
                    <b-tabs card>
                        <b-tab title="Types" active>
                            <types></types>
                        </b-tab>
                        <b-tab title="Marques">
                            <brands></brands>
                        </b-tab>
                        <b-tab title="Modeles">
                            <models></models>
                        </b-tab>
                        <b-tab title="Prix">
                            <pricecases></pricecases>
                        </b-tab>
                    </b-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import ThemifyIcon from "vue-themify-icons";
import brc from '../custom/breadc.vue'
import axios from 'axios';
import brands from './brands-manage.vue'
import types from './types-manage.vue'
import pricecases from './pricescases-manage.vue'
import models from './models-manage.vue'
/* eslint-disable */
export default {
    components: {
        ThemifyIcon,
        brc,
        brands,
        types,
        models,
        pricecases
    },
    data(){
        return{
            
        }
    },
    methods:{
        
    }
}
</script>

<style>
.card {
    border-radius: 0;
}
.nav-tabs .nav-link {
    border-top-left-radius: 10%;
    border-top-right-radius: 10%;
}
</style>