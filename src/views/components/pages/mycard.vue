<template>
    <div class="container-fluid">
        <div class="row">
            <!-- Column -->
            <div class="col-md-12 col-lg-9">
                <div class="card">
                    <div class="card-header bg-info">
                        <h5 class="m-b-0 text-white">Mon panier </h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table product-overview">
                                <thead>
                                    <tr>
                                        <th>Titre</th>
                                        <th>Prix</th>
                                        <th style="text-align:center">Supprimer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="prd in productsCollectins " :key="prd.id" >
                                        <td width="550">
                                            <h5 class="font-500"> {{ prd.name }} </h5>
                                            <p>
                                                {{ prd.description }}
                                            </p>
                                        </td>
                                        <td > {{ prd.prix_vente }} €</td>
                                        <td align="center">
                                            <button @click="deleteItem(prd.id)" href="javascript:void(0)" class=" btn text-inverse" title="" data-bs-toggle="tooltip" data-original-title="Delete">
                                                <i class="ti-trash text-dark"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Column -->
            <div class="col-md-12 col-lg-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Total</h5>
                        <hr>
                        <h2>{{ total }} €</h2>
                        <hr>
                        <button :disabled="total == 0" @click="payeOrder" class="btn btn-success text-white">Payer ma commande</button>
                        <a href="#/store" class="btn btn-dark btn-outline" ><i class="fa fa-arrow-left"></i> Continue mes achats</a>
                    </div>
                </div>
            </div>
            <vs-popup class="holamundo" title="Payer ma commande" :active.sync="payingCommand">
                <div class="card">
                    <div class="card-body">
                        <div v-if="payingCommand" class="col-md-12">
                            <div>
                                <div class="form-group input-group m-t-40" :class="{ 'input-icon-validate-danger' : $v.exp_month.$error }">
                                    <vs-input icon="credit_card" :danger="$v.cardnum.$error" class="inputx mb-4 col-11" placeholder="Numéro de la carte" v-model="cardnum"/>
                                </div>
                                <div class="row">
                                    <div class="col-xs-4 col-md-4 mr-3" :class="{ 'input-icon-validate-danger' : $v.exp_month.$error }">
                                        <div class="form-group">
                                            <label class="form-label">EXP: mois</label>
                                            <vs-input :danger="$v.exp_month.$error" type="number" class="inputx mb-4" placeholder="MM" v-model="exp_month"/>
                                        </div>
                                    </div>
                                    <div class="col-xs-4 col-md-4 mr-3" :class="{ 'has-danger' : $v.exp_year.$error }">
                                        <div class="form-group">
                                            <label class="form-label">EXP: Année</label>
                                            <vs-input :danger="$v.exp_year.$error" type="number" class="inputx mb-4" placeholder="YYYY" v-model="exp_year"/>
                                        </div>
                                    </div>
                                    <div class="col-xs-4 col-md-4 mr-3" :class="{ 'input-icon-validate-danger' : $v.cvc.$error }">
                                        <div class="form-group">
                                            <label class="form-label">CV </label>
                                            <vs-input :danger="$v.cvc.$error" class="inputx mb-4" placeholder="CVC" v-model="cvc"/>
                                        </div>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-12 ">
                                        <div class="form-group">
                                            <label class="form-label">Adresse de livraison</label> <code> (Ex : 1 rue de paris, Paris 75001) </code> 
                                            <vs-input :danger="$v.adresse.$error" class="inputx mb-4 col-11" placeholder="Ex : 1 rue de paris, Paris 75020" v-model="adresse"/>
                                        </div>
                                    </div>
                                </div>
                                <button @click="payeCard" class="btn btn-info text-white">Payer</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </vs-popup>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { required, requiredIf } from 'vuelidate/lib/validators'
import auth from '../../../auth'
/* eslint-disable */ 
export default {
    data() {
        return {
            auth: auth,
            productsCollectins: [],
            total: 0,
            payingCommand: false,
            adresse: null,
            cardnum: null,
            exp_month: null,
            exp_year: null,
            cvc: null
        }
    },
    mounted(){
        this.loadMyCart()
        this.adresse = auth.user.adresse
    },
    methods: {
        payeOrder(){
            this.payingCommand = true
        },
        loadMyCart(){
            axios.get('card/me')
                .then(res=>{
                    this.total = 0
                    if( res.data.rows.length > 0 ){
                        console.log( ' CARD RES -- :: ', res.data.rows[0].produits )
                        this.productsCollectins = res.data.rows[0].produits
                        this.productsCollectins.forEach( product => {
                            this.total += product.prix_vente
                            console.log( product )
                            console.log(  "  JSON.parse ::: ",JSON.parse(product.state ))
                        } )
                    }
                    
                })
        },
        payeCard(){
            this.$v.$touch()
            if(!this.$v.$invalid){
                axios.post('orders/create', {
                    number: this.cardnum,
                    exp_month: this.exp_month,
                    exp_year: this.exp_year ,
                    cvc: this.cvc ,
                    adresse: this.adresse
                }).then(res => {
                        this.payingCommand = false
                        swal("Paiement réussi!", 
                            "Votre commande à bien été enregistrée, une facture vous est envoyé par mail!",
                            "success")
                        this.productsCollectins = []
                        this.$parent.loadMyCart()
                }, err=> {
                    swal("Erreur!", 
                        "une erreur est survenue veuillez réessayer ultérieurement!",
                        "error")
                } )
            }
        },
        deleteItem(id){
            console.log( ' DELETE ID ::: ', id  )
            axios.delete('card/delete/'+id)
                .then(res => {
                    this.loadMyCart()
                    this.$parent.loadMyCart()
                })
        }
    },
    validations: {
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
        },
        adresse: {
            required
        }
    }

}
</script>

<style>
.card-header:first-child {
    border-radius: 0;
}
</style>