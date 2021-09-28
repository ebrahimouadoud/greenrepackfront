<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Revente'" 
                :crlink="'#/resall/new'"
                :ope="'Toutes les reventes'" 
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
                <template v-slot:cell(etat)="data">
                    
                    <span v-if="data.item.etat=='En Attendant'" class="label label-warning">En attente</span>
                    <span v-else-if="data.item.etat=='Validé'" class="label label-success">Validé</span>
                    <span v-else-if="data.item.etat=='Refusé'" class="label label-danger">Refusé</span>
                    <span v-else-if="data.item.etat=='Accepté'" class="label label-info">Accepté</span>
                    <span v-else-if="data.item.etat=='CO'" class="label label-inverse">Contre offre</span>
                </template>
                <template v-slot:cell(Gérer)="data">

                    <button type="button" style="border-radius: 5%;" class="btn btn-info " 
                        @click="manageResall(data.item)"
                        ><i class="ti-eye"></i> 
                    </button>
                    
                </template>
                </b-table>    
                <vs-popup title="Gérer votre revente" :active.sync="managingResall">
                    <div v-if="managingResall">
                        <vs-alert v-if="resallOnManage.etat=='Accepté'"  title="Accepté" active="true" color="rgb(41, 147, 138)" class="mb-3">
                            La proposition est accepté par le revendeur.
                        </vs-alert>
                        <vs-alert v-if="resallOnManage.produit.phase == 'Reçu' && resallOnManage.etat=='Accepté' " title="Produit reçu" active="true" color="rgb(41, 147, 138)" class="mb-3">
                            Produit reçu vous pouvez valider la revente ou faire un contre offre.
                        </vs-alert>
                        <vs-alert v-if="resallOnManage.etat=='Validé'"  title="Validé" active="true" color="rgb(41, 147, 138)" class="mb-3">
                            La revente est validée.
                        </vs-alert>
                        <vs-alert v-if="resallOnManage.etat=='Refusé'"  title="Refusé" active="true" color="danger" class="mb-3">
                            La revente est refusée par le revendeur.
                        </vs-alert>
                        <div class="vs-list">
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Titre</div>
                                    <div class="vs-list--subtitle"> {{ resallOnManage.produit.name }} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Envoyé le :</div>
                                    <div class="vs-list--subtitle"> {{ resallOnManage.produit.createdAt | formatDate }} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Couleur</div>
                                    <div class="vs-list--subtitle"> {{ resallOnManage.produit.color }} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Age (mois)</div>
                                    <div class="vs-list--subtitle"> {{ resallOnManage.produit.age }} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Proposition</div>
                                    <div class="vs-list--subtitle"> {{ resallOnManage.prixPropose }} €  </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Modèle</div>
                                    <div class="vs-list--subtitle"> {{ resallOnManage.produit.modele.name }}  </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">BIC du revendreur</div>
                                    <div class="vs-list--subtitle"> {{ resallOnManage.bic }}  </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">IBAN du revendreur</div>
                                    <div class="vs-list--subtitle"> {{ resallOnManage.iban }}  </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                        </div>
                        <div v-if="resallOnManage.etat=='Accepté'" >
                            <vs-button v-if="resallOnManage.produit.phase == 'En Attend' " @click="notifyArrival(resallOnManage.produit.id)" class="ml-5" color="warning" type="filled">
                                Acuser de reception
                            </vs-button>
                            <vs-button v-if="resallOnManage.produit.phase == 'Reçu' " @click="validateResall(resallOnManage.id)" class="ml-5" color="rgb(3, 169, 243)" type="filled">Valider</vs-button>
                            <vs-button v-if="resallOnManage.produit.phase == 'Reçu' " @click="makeCounterOffer()" class="ml-5" color="danger" type="filled">Faire une contre offre.</vs-button>
                        </div>
                    </div>
                    <vs-popup classContent="popup-example" title="Faire une contre offre" :active.sync="makingCounterOffer">
                        <vs-input :danger="$v.proposition.$error" type="number" class="inputx mb-4 col-11" placeholder="Proposition" v-model="proposition"/>
                        <vs-button @click="acceptResall" color="primary" type="filled">
                            Valider
                        </vs-button>
                    </vs-popup>
                </vs-popup>
            </div>
        </div>
    </div>
</template>
<script>
import ThemifyIcon from "vue-themify-icons";
import brc from '../custom/breadc.vue'
import axios from 'axios';
import { required } from 'vuelidate/lib/validators'
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
                    {label: "Prix", key :"prixPropose"  },
                    {label: "Status", key: "etat" },
                        "Gérer"],
            isBusy: false,
            proposition: null,
            tRows: 0,
            managingResall: false,
            resallOnManage: null,
            makingCounterOffer: false
        }
    },
    mounted(){
        //this.loadData()
    },
    watch:{
        managingResall: function (val, newVal) {
            console.log(' newVal, val :: ', newVal , val)
        }
    },
    methods:{
        proceedAccept(){
            this.makingCounterOffer = true
        },
        loadData(ctx, callback){
            console.log("loading")
            axios.get('/resall/all' )
            .then( result => {
                console.log(result.data.Resall)
                this.tRows = result.data.total
                callback(result.data.Resall)
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
        },
        notifyArrival(id){
            axios.post('product/notifyarrival/' + id )
                    .then(result =>{
                            swal("",
                                "Notifié.",
                                "success");
                            this.managingResall = false
                            this.resallOnManage = null
                            this.makingCounterOffer = false
                            this.$refs.resalls.refresh();
                            this.$refs.resalls.refresh();
                            this.$refs.resalls.refresh();
                        },error => {
                            swal("Erreur!",
                                "Une erreur est survenue, veuillez contacter un administrateur",
                                "error");
                        }
                    )
        },
        validateResall(id){
            axios.put('resall/validate/' + id )
                    .then(result =>{
                            swal("",
                                "Validé.",
                                "success");
                            this.managingResall = false
                            this.resallOnManage = null
                            this.makingCounterOffer = false
                            this.$refs.resalls.refresh();
                            this.$refs.resalls.refresh();
                            this.$refs.resalls.refresh();
                        },error => {
                            swal("Erreur!",
                                "Une erreur est survenue, veuillez contacter un administrateur",
                                "error");
                        }
                    )
        },
        manageResall(item){
            this.managingResall = true
            this.resallOnManage = item 
        },
        makeCounterOffer(){
            this.makingCounterOffer = true
        },
        acceptResall(){
            this.$v.$touch()
            console.log(this.$v)
            if(this.$v.$invalid){
                //this.FormValsError = true
            }else{
                axios.post('resall/counteroffer/' + this.resallOnManage.id, {
                    prix_propose: this.proposition
                } )
                    .then(result =>{
                            swal("",
                                "Acceptée.",
                                "success");
                            this.managingResall = false
                            this.resallOnManage = null
                            this.makingCounterOffer = false
                            this.$refs.resalls.refresh();
                            this.$refs.resalls.refresh();
                            this.$refs.resalls.refresh();
                        },error => {
                            swal("Erreur!",
                                "Une erreur est survenue, veuillez contacter un administrateur",
                                "error");
                        }
                    )
            }
            
        },
        refuseResall(id){
            console.log(' REFUSE :: ', id)
            axios.put('/resall/proposal/refuse/' + id )
                .then(result =>{
                        swal("",
                            "Acceptée.",
                            "success");
                        this.$refs.resalls.refresh();
                        this.managingResall = false
                        this.resallOnManage = null 
                    },error => {
                        swal("Erreur!",
                            "Une erreur est survenue, veuillez contacter un administrateur",
                            "error");
                    }
                )
        }
    },
    validations: {
        proposition: {
          required,
        }
    }
}
</script>

<style>
.card {
    border-radius: 0;
}
</style>