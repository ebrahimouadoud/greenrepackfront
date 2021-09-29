<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Mes commandes'" 
                :crlink="'#/resall/new'"
                :ope="'Consulter'" 
                :showbtn="false">
            </brc>
        </div>

        <div class="card">
            <div class="card-body">
                <b-table
                    ref="resalls"
                    :items="loadData"
                    :busy="isBusy"
                    :fields="fields"
                    class="mt-3"
                    outlined>
                <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Chargement...</strong>
                    </div>
                </template>
                <template v-slot:cell(prixPropose)="data">
                    {{ data.item.prixPropose + "€" }}
                </template>
                <template v-slot:cell(createdAt)="data">
                    {{ data.item.createdAt | formatDate }}
                </template>
                <template v-slot:cell(status)="data">
                    
                    <span v-if="data.item.status=='Confirmé'" class="label label-info" style="border-radius: 0;">Confirmé</span>
                    <span v-else-if="data.item.status=='Envoyé'" class="label label-success" style="border-radius: 0;">Envoyé</span>
                </template>
                <template v-slot:cell(trackingNumber)="data">
                    <span v-if="data.item.trackingNumber " class="label label-inverse" style="border-radius: 0;"> {{ data.item.trackingNumber }} </span>
                    <span v-else class="label label-inverse" style="border-radius: 0;"> En attente d'envoie </span>
                </template>
                </b-table>    

            </div>
        </div>
    </div>
</template>
<script>
import ThemifyIcon from "vue-themify-icons";
import brc from '../custom/breadc.vue'
import axios from 'axios';
import { required, requiredIf } from 'vuelidate/lib/validators'
/* eslint-disable */
export default {
    components: {
        ThemifyIcon,
        brc
    },
    data(){
        return{
            fields: [ 
                    {label: "Date et heure", key: "createdAt" },
                    {label: "Montant", key :"sumPrix"  },
                    {label: "Status", key: "status" },
                    {label: "Numéro de suivi", key: "trackingNumber" },
                        ],
            isBusy: false,
            tRows: 0,
            managingOrder: false
        }
    },
    mounted(){
        //this.loadData()
    },
    watch:{
        managingOrder: function (val, newVal) {
            console.log(' newVal, val :: ', newVal , val)
        }
    },
    methods:{
        loadData(ctx, callback){
            console.log("loading")
            axios.get('/orders/me' )
            .then( result => {
                console.log(result.data)
                this.tRows = result.data.total
                callback(result.data.rows)
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
        },
        
    },
}
</script>

<style>
.card {
    border-radius: 0;
}
</style>