<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Commande'" 
                :crlink="'#/resall/new'"
                :ope="'Gestion'" 
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
                <template v-slot:cell(Gérer)="data">

                    <button type="button" style="border-radius: 5%;" class="btn btn-info " 
                        @click="manageOrder(data.item)"
                        ><i class="ti-eye"></i> 
                    </button>
                    
                </template>
                </b-table>    
                <vs-popup title="Gérer votre revente" :active.sync="managingOrder">
                    <div v-if="managingOrder">
                        <div class="vs-list">
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Nom du client</div>
                                    <div class="vs-list--subtitle"> {{ orderOnManage.user.firstname + " " +orderOnManage.user.lastname }} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">adresse mail</div>
                                    <div class="vs-list--subtitle"> {{ orderOnManage.user.email}} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">adresse de livraison</div>
                                    <div class="vs-list--subtitle"> {{ orderOnManage.adresseLivraison}} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title"> Articles </div>
                                    <h5 class=" text-block"> {{ orderOnManage.produits | tonewline }} </h5>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                        </div>
                        <div v-if="orderOnManage.status=='Confirmé'" >
                            <vs-alert  title="Commande a envoyer" active="true" color="warning" class="mb-3">
                                Commande confirmé, renseignez le numéro de suivie pour confirmer l'envoie.
                            </vs-alert>
                            <vs-input :danger="$v.tracking.$error"  class="inputx mb-4 col-11" placeholder="Numéro de suivie" v-model="tracking"/>
                            <vs-button v-if="orderOnManage.status=='Confirmé'"  @click="sendOrder(orderOnManage.id)" color="primary" type="filled">
                                Envoyer
                            </vs-button>
                        </div>
                        
                        <div v-if="orderOnManage.status=='Envoyé'" >
                            <vs-alert  title="Commande envoyée" active="true" color="warning" class="mb-3">
                                Numéro de suivie: {{ orderOnManage.trackingNumber }}
                            </vs-alert>
                        </div>
                    </div>
                    
                </vs-popup>
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
                    "Gérer"
                        ],
            isBusy: false,
            tRows: 0,
            managingOrder: false,
            orderOnManage: null,
            tracking: null
        }
    },
    filters:{
        tonewline: function(val){
            return val.replace('|', '\n'); 
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
            axios.get('/orders' )
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
        manageOrder(item){
            this.managingOrder = true
            this.orderOnManage = item 
        },
        sendOrder(id){
            //orders/send/
             this.$v.$touch()
            if(this.$v.tracking.$error ){
                //
            }else{
                axios.put('orders/send/' + id, {
                    tracking: this.tracking
                } )
                    .then(result =>{
                            swal("",
                                "Envoie enregistré.",
                                "success");
                            this.orderOnManage = null 
                            this.managingOrder = false
                            this.$refs.resalls.refresh();
                            this.$refs.resalls.refresh();
                            this.$refs.resalls.refresh();
                        },error => {
                            this.orderOnManage = null
                            this.managingOrder = true
                            this.$refs.resalls.refresh();
                            swal("Erreur!",
                                "Veuillez réessayez.",
                                "error");
                        }
                    )
            }
        }

    },
    validations: {
        tracking:{
            required,
        }
    }
}
</script>

<style>
.card {
    border-radius: 0;
}
.text-block {
    white-space: pre; 
}
</style>