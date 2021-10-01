<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Revente'" 
                :crlink="'#/resall/new'"
                :ope="'Mes reventes'" 
                :showbtn="true">
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
                    <div v-if="data.item.prixPropose">
                        {{ data.item.prixPropose + "€" }}
                    </div>
                    <div v-else>
                        <span style="border-radius: 0px;" class="label label-warning">En attente</span>
                    </div>
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

                    <button :disabled="data.item.etat=='Refusé' || data.item.etat=='Validé'" type="button" style="border-radius: 5%;" class="btn btn-info " 
                        @click="manageResall(data.item)"
                        ><i class="ti-eye"></i> 
                    </button>
                    
                </template>
                </b-table>    
                <vs-popup title="Gérer votre revente" :active.sync="managingResall">
                    <div v-if="managingResall">
                        <vs-alert v-show="resallOnManage.etat=='En Attendant' && resallOnManage.prixPropose"  title="En Attente" active="true" color="warning" class="mb-3">
                            La revente est en attente vous pouvez accepté ou refuser.
                        </vs-alert>
                        <vs-alert v-show="resallOnManage.etat=='En Attendant' && !resallOnManage.prixPropose"  title="En Attente de proposition" active="true" color="warning" class="mb-3">
                            La revente va être valeurisée par un de nos agents.
                        </vs-alert>
                        <vs-alert v-if="resallOnManage.etat=='CO' && resallOnManage.prixPropose"  title="En Attente" active="true" color="warning" class="mb-3">
                            Après la vérification du produit, Green repack vous propose une contre offre à {{resallOnManage.prixPropose}}€.
                            Si vous refuser la contre offre, vous allez devoir payer les frais de retour de votre produit.
                        </vs-alert>
                        <div v-if="resallOnManage.etat=='CO' == resallOnManage.prixPropose" >
                            <vs-button @click="acceptCounterOffer()" class="ml-5" color="success" type="filled">Accepter</vs-button>
                            <vs-button @click="proceedRefuseCO()" class="ml-5" color="danger" type="filled">Refuser</vs-button>
                        </div>
                        <div v-if="resallOnManage.etat=='En Attendant' && resallOnManage.prixPropose" >
                            <vs-button @click="proceedAccept()" class="ml-5" color="success" type="filled">Accepter</vs-button>
                            <vs-button @click="refuseResall(resallOnManage.id)" class="ml-5" color="danger" type="filled">Refuser</vs-button>
                        </div>
                        <p v-if="resallOnManage.etat=='Accepté'" >
                            <vs-alert title="Accepté" active="true" color="rgb(41, 147, 138)" class="mb-3">
                                Vous avez accepté la revente, vous allez être informé lors de la récéption.
                            </vs-alert>
                        </p>
                    </div>
                    <div v-else>
                         <vs-alert title="Accepté" active="true" color="rgb(41, 147, 138)" class="mb-3">
                                Vous avez accepté la revente, vous allez être informé lors de la récéption.
                            </vs-alert>
                    </div>
                    <vs-popup classContent="popup-example" title="Vos Informations Bancaires" :active.sync="accepting">
                        <vs-input :danger="$v.bic.$error" class="inputx mb-4 col-11" placeholder="BIC" v-model="bic"/>
                        <vs-input :danger="$v.iban.$error" class="inputx mb-4 col-11" placeholder="IBAN" v-model="iban"/>
                        <vs-button @click="acceptResall" color="primary" type="filled">
                            Valider
                        </vs-button>
                    </vs-popup>
                    <vs-popup classContent="popup-example" title="Vos Informations Bancaires" :active.sync="refusingCounterOffer">
                        <vs-input :danger="$v.cardnum.$error" class="inputx mb-4 col-11" placeholder="Numéro de la carte" v-model="cardnum"/>
                        <vs-input :danger="$v.exp_month.$error" class="inputx mb-4 col-3" placeholder="Mois d'expèration" v-model="exp_month"/>
                        <vs-input :danger="$v.exp_year.$error" class="inputx mb-4 col-3" placeholder="Année d'expèration" v-model="exp_year"/>
                        <vs-input :danger="$v.cvc.$error" class="inputx mb-4 col-4" placeholder="CVC" v-model="cvc"/>
                        <vs-button @click="refuseCO" color="primary" type="filled">
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
                    {label: "Prix", key :"prixPropose"  },
                    {label: "Status", key: "etat" },
                        "Gérer"],
            isBusy: false,
            iban: null,
            bic: null,
            tRows: 0,
            managingResall: false,
            resallOnManage: null,
            accepting: false,
            refusingCounterOffer: false,
            cardnum: null,
            exp_month: null,
            exp_year: null,
            cvc: null
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
            this.accepting = true
        },
        acceptCounterOffer(){
            ///api/resall/counteroffer/accept
            axios.put('resall/counteroffer/accept/' + this.resallOnManage.id )
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
        },
        proceedRefuseCO(){
            this.refusingCounterOffer = true
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
        manageResall(item){
            this.managingResall = true
            this.resallOnManage = item 
        },
        refuseCO(){
            this.$v.$touch()
            if(this.$v.cardnum.$error || this.$v.exp_month.$error || this.$v.exp_year.$error || this.$v.cvc.$error){
                //
            }else{
                axios.put('/resall/counteroffer/refuse/' + this.resallOnManage.id, {
                    number: this.cardnum,
                    exp_month: this.exp_month ,
                    exp_year: this.exp_year ,
                    cvc: this.cvc
                } )
                    .then(result =>{
                            swal("",
                                "Refus enregistré.",
                                "success");
                            this.managingResall = false
                            this.resallOnManage = null
                            this.accepting = false
                            this.refusingCounterOffer = false
                            this.$refs.resalls.refresh();
                            this.$refs.resalls.refresh();
                            this.$refs.resalls.refresh();
                        },error => {
                            this.managingResall = false
                            this.accepting = false
                            this.resallOnManage = null
                            this.refusingCounterOffer = false
                            swal("Paiement refusé!",
                                "Veuillez réessayez.",
                                "error");
                        }
                    )
            }
        },
        acceptResall(){
            this.$v.$touch()
            console.log(this.$v)
            console.log(' this.accepting :: ', this.accepting, ' :: $v.iban.$error :: ', this.$v.iban.$error)
            if(this.$v.iban.$error || this.$v.bic.$error){
                //this.FormValsError = true
            }else{
                axios.put('/resall/proposal/accept/' + this.resallOnManage.id, {
                    bic: this.bic,
                    iban: this.iban
                } )
                    .then(result =>{
                            swal("",
                                "Acceptée.",
                                "success");
                            this.managingResall = false
                            this.resallOnManage = null
                            this.accepting = false
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
        iban:{
            required,
        },
        bic: {
          required,
        },
        cardnum: {
          required,
        },
        exp_month: {
          required,
        },
        exp_year: {
          required,
        },
        cvc: {
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