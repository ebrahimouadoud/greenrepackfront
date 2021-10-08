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
                    
                    <span v-if="data.item.etat=='En attente'" class="label label-warning">En attente</span>
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
                        <vs-alert v-show="resallOnManage.etat=='En attente' && resallOnManage.prixPropose"  title="En Attente" active="true" color="warning" class="mb-3">
                            La revente est en attente vous pouvez accepté ou refuser.
                        </vs-alert>
                        <vs-alert v-show="resallOnManage.etat=='En attente' && !resallOnManage.prixPropose"  title="En Attente de proposition" active="true" color="warning" class="mb-3">
                            La revente va être valeurisée par un de nos agents.
                        </vs-alert>
                        <vs-alert v-if="resallOnManage.etat=='CO' && resallOnManage.prixPropose"  title="En Attente" active="true" color="warning" class="mb-3">
                            Après la vérification du produit, Green repack vous propose une contre offre à {{resallOnManage.prixPropose}}€.
                            Si vous refuser la contre offre, vous allez devoir payer les frais de retour de votre produit.
                        </vs-alert>
                        <div v-if="resallOnManage.etat=='CO' " >
                            <vs-button @click="acceptCounterOffer()" class="ml-5" color="success" type="filled">Accepter</vs-button>
                            <vs-button @click="proceedRefuseCO()" class="ml-5" color="danger" type="filled">Refuser</vs-button>
                        </div>
                        <div v-if="resallOnManage.etat=='En attente' && resallOnManage.prixPropose" >
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
                    <vs-popup classContent="popup-example" title="Vos Informations Bancaires." :active.sync="accepting">
                        <vs-input :danger="$v.bic.$error" class="inputx mb-4 col-11" placeholder="BIC" v-model="bic"/>
                        <vs-input :danger="$v.iban.$error" class="inputx mb-4 col-11" placeholder="IBAN" v-model="iban"/>
                        <code v-if="! validIBAN"> IBAN invalide.  </code> 
                        <vs-button @click="acceptResall" color="primary" type="filled">
                            Valider
                        </vs-button>
                    </vs-popup>
                    <vs-popup classContent="popup-example" title="Données de votre carte de paiement." :active.sync="refusingCounterOffer">
                        <div v-if="!loadingPay">
                            <vs-input :danger="$v.cardnum.$error" class="inputx mb-4 col-11" placeholder="Numéro de la carte" v-model="cardnum"/>
                            <vs-input :danger="$v.exp_month.$error" class="inputx mb-4 col-3" placeholder="Mois d'expèration" v-model="exp_month"/>
                            <vs-input :danger="$v.exp_year.$error" class="inputx mb-4 col-3" placeholder="Année d'expèration" v-model="exp_year"/>
                            <vs-input :danger="$v.cvc.$error" class="inputx mb-4 col-4" placeholder="CVC" v-model="cvc"/>
                            <vs-button @click="refuseCO" color="primary" type="filled">
                                Valider
                            </vs-button>
                        </div>
                        <div v-else class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Payement en cours ... </strong>
                        </div>
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
                    {label: "Produit", key: "produit.name" },
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
            cvc: null,
            loadingPay: false,
            validIBAN: false
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
        mod97(string) {
            var checksum = string.slice(0, 2), fragment;
            for (var offset = 2; offset < string.length; offset += 7) {
                fragment = String(checksum) + string.substring(offset, offset + 7);
                checksum = parseInt(fragment, 10) % 97;
            }
            return checksum;
        },
        isValidIBANNumber(input) {
            var CODE_LENGTHS = {
                AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
                CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
                FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
                HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
                LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
                MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
                RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26,   
                AL: 28, BY: 28, CR: 22, EG: 29, GE: 22, IQ: 23, LC: 32, SC: 31, ST: 25,
                SV: 28, TL: 23, UA: 29, VA: 22, VG: 24, XK: 20
            };
            var iban = String(input).toUpperCase().replace(/[^A-Z0-9]/g, ''),
                    code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/),
                    digits;
            if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
                return false;
            }
            digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
                return letter.charCodeAt(0) - 55;
            });
            return this.mod97(digits);
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
                this.loadingPay = true
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
                            this.loadingPay = false
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
                            this.loadingPay = false
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
            console.log( ' :::: isValidIBANNumber ::::: ', this.isValidIBANNumber(this.iban) )
            this.validIBAN = this.isValidIBANNumber(this.iban)
            
            if(this.$v.iban.$error || this.$v.bic.$error || !this.validIBAN ){
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