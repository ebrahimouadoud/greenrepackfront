<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Produits disponibles'" 
                :ope="'Gestion'" 
                :showbtn="false">
            </brc>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-12 col-md-9">
                        <div class="dataTables_length" id="example_length">
                            <label>Nombre d'elements par page: 
                                <select name="example_length" 
                                    v-model="p_Page" class="form-control form-control-sm">
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-3">
                        <div id="example_filter" class="dataTables_filter">
                            <label>Recherche:
                                <input type="search" 
                                    class="form-control form-control-sm" 
                                    placeholder="nom"
                                    v-model="search"
                                >
                            </label>
                            <button type="button" @click="filter" class="btn btn-secondary">
                                <ThemifyIcon icon="search" /> 
                            </button>
                        </div>
                    </div>
                </div>
                <vs-row>
                    <vs-col v-for="prd in productsCollection" :key="prd.id" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-card actionable>
                            <div slot="header">
                            <h5 class="font-weight-bold"> {{prd.name}} </h5>
                            </div>
                            <div slot="media">
                            <img src="@/assets/images/big/img5.jpg" />
                            </div>
                            <div class="mb-2">
                                <h6 class="mb-2">
                                    Prix : {{ prd.prix_vente }}€
                                </h6>
                            <span
                                class="py-2 d-block"
                            > {{ prd.description.substring(0,30) }}... </span>
                            </div>
                            <vs-button color="primary" type="border"><i class="mdi mdi-eye"></i> Consulter </vs-button>
                            <vs-button @click="addProductToCard(prd.id)"
                             color="primary" class="ml-3" type="border"> <i class="mdi mdi-cart-plus"> </i> </vs-button>
                        </vs-card>
                    </vs-col>
                </vs-row>
                <div class="mt-3">
                    <b-pagination
                        v-model="c_Page"
                        :total-rows="tRows"
                        :per-page="p_Page"
                        aria-controls="my-table"
                    ></b-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ThemifyIcon from "vue-themify-icons";
import brc from '../custom/breadc.vue'
import axios from 'axios';
import { required, email, sameAs, minLength, requiredUnless, requiredIf } from 'vuelidate/lib/validators'
/* eslint-disable */
export default {
    components: {
        ThemifyIcon,
        brc
    },
    data(){
        return{
            fields: [ {label: "Titre", key :"name"  },
                    {label: "Modèle", key: "modele.name" },
                    {label: "Marchand", key: "user.email" },
                    {label: "Valeur (A)", key: "prixPropose" },
                    {label: "Phase", key: "phase" },
                        "Actions"],
            c_Page: 1,
            p_Page: 20,
            search:'',
            tSearch: '',
            isBusy: false,
            tRows: 0,
            productToSale: null,
            salingProduct: false,
            prixDeVente: null, 
            nameDeVente: null,
            productsCollection: []
        }
    },
    mounted(){
        this.loadData()
    },
    methods:{
        loadData(){
            console.log("loading")
            
            axios.get('/products/all' )
            .then( result => {
                console.log(result.data.Products)
                this.productsCollection = result.data.Products
                this.tRows = result.data.Products.length
                this.isBusy = false
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
            
        },
        addProductToCard(id){
            axios.post('/card/' + id )
                .then(result =>{
                        swal("Produit ajouté a votre panier",
                                "",
                                "success");
                        this.$parent.loadMyCart()
                    },error => {
                        swal("Erreur!",
                                "Une erreur est survenue",
                                "error");
                    }
                )
        },
        putProductOnSale(){
            axios.post('/product/sale/' + this.productToSale.id , {
                prix_vente : this.prixDeVente,
                name : this.nameDeVente
            } )
                .then(result =>{
                        this.salingProduct = false
                        this.productToSale = null
                        this.prixDeVente = null
                        this.nameDeVente = null
                        swal("Enregistré",
                                "LeLe projet est mis en vente avec success.",
                                "success");
                    },error => {
                        swal("Erreur!",
                                "Une erreur est survenue",
                                "error");
                    }
                )
        },
        filter(){
            this.tSearch = this.search
            this.c_Page = 1
        },
    },
    validations: {
        prixDeVente: {
          required,
        },
        nameDeVente: {
          required,
        },
    }
}
</script>

<style>
.card {
    border-radius: 0;
}
</style>