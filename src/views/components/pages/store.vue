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
                    <div class="col-sm-12 col-md-2 ml-4">
                        <div class="dataTables_length" id="example_length">
                            <label> Type :  </label>
                            <div class="vs-con-input">
                                <b-form-select class="vs-inputx vs-input--input normal" v-model="search.selectedType">
                                    <b-form-select-option :value="null">Choisir le type</b-form-select-option>
                                    <option v-for="option in typesCollection" :value="option" :key="option.id">
                                        {{ option.name }}
                                    </option>
                                </b-form-select>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-2 ml-3">
                        <div id="example_filter" class="dataTables_filter">
                            <label>Titre:
                            </label>
                            <input type="search" 
                                    class="form-control form-control-sm" 
                                    placeholder="Titre"
                                    v-model="search.titre"
                                >
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-1 ml-5">
                        <div id="example_filter" class="dataTables_filter">
                            <label>Filtrer:
                            <button type="button" @click="filter" 
                                class="btn mt-2 ml-2 btn-secondary ">
                                <ThemifyIcon icon="search" /> 
                            </button>
                            </label>
                            
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
                            <vs-button @click="checkProduct(prd)" color="primary" type="border"><i class="mdi mdi-eye"></i> Consulter </vs-button>
                            <vs-button @click="addProductToCard(prd.id)"
                             color="primary" class="ml-3" type="border"> <i class="mdi mdi-cart-plus"> </i> </vs-button>
                        </vs-card>
                    </vs-col>
                </vs-row>
                <vs-popup title="Détails du produit" :active.sync="showingProduct">
                    <prdcard v-if="showingProduct" :product="productOnShow" :showEdit="false"></prdcard>
                </vs-popup>
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
import prdcard from './product-card.vue'
import { required, email, sameAs, minLength, requiredUnless, requiredIf } from 'vuelidate/lib/validators'
/* eslint-disable */
export default {
    components: {
        ThemifyIcon,
        brc,
        prdcard
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
            productsCollection: [],
            typesCollection:[],
            productOnShow: null,
            showingProduct: null,
            search:{
                selectedType: null,
                titre: null
            },
        }
    },
    mounted(){
        this.loadData()
        axios.
            get('/categories/all').then( res => {
                 console.log( 'REs : ', res.data.rows)
                this.typesCollection = res.data.rows
            })
    },
    methods:{
        checkProduct(prd){
            this.showingProduct = true
            this.productOnShow = prd
        },
        loadData(){
            console.log("loading")
            let query = ''
            if(this.search.titre)
                query+= "?titre=" + this.search.titre
            if(this.search.selectedType)
                query = query.length > 0 ? query + "&type=" + this.search.selectedType.id  : query + "?type=" + this.search.selectedType.id
            if(this.search.selectedPhase)
                query = query.length > 0 ? query + "&phase=" + this.search.selectedPhase : query + "?phase=" + this.search.selectedPhase
            if(this.search.selectedWarehouse)
                query = query.length > 0 ? query + "&warehouse=" + this.search.selectedWarehouse.id :  "?warehouse=" + this.search.selectedWarehouse.id

            axios.get('/products/all' + query )
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
            this.loadData()
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