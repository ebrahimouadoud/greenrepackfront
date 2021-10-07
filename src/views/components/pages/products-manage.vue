<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Produit'" 
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
                        <div class="dataTables_length" id="example_length">
                            <label> Phase :  </label>
                            <div class="vs-con-input">
                                <b-form-select :options="phasesCollection" class="vs-inputx vs-input--input normal" v-model="search.selectedPhase">
                                    <b-form-select-option :value="null">Choisir la phase</b-form-select-option>
                                </b-form-select>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-2 ml-3">
                        <div class="dataTables_length" id="example_length">
                            <label> Entrepot :  </label>
                            <div class="vs-con-input">
                                <b-form-select class="vs-inputx vs-input--input normal" v-model="search.selectedWarehouse">
                                    <b-form-select-option :value="null">Choisir la phase</b-form-select-option>
                                    <option v-for="option in warehousesCollection" :value="option" :key="option.id">
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
                <b-table
                    ref="productsList"
                    :items="productsCollection"
                    :busy="isBusy"
                    :fields="fields"
                    class="mt-3"
                    :per-page="p_Page"
                    :current-page="c_Page"
                    outlined>
                <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Chargement...</strong>
                    </div>
                </template>
                <template v-slot:cell(prixPropose)="data">
                    <div v-if="data.item.revente.prixPropose">
                        {{ data.item.revente.prixPropose + "€" }}
                    </div>
                    <div v-else>
                        <span style="border-radius: 0px;" class="label label-warning">En attente</span>
                    </div> 
                </template>
                <template v-slot:cell(phase)="data">
                    
                    <span v-if="data.item.phase=='En attente' && (data.item.revente.etat=='En attente' || data.item.revente.etat=='Accepté')" class="label label-warning">En attente</span>
                    <span v-else-if="data.item.phase=='Renvoyé'" class="label label-danger">Renvoyé</span>
                    <span v-else-if="data.item.revente.etat=='Refusé'" class="label label-danger">Revente refusé</span>
                    <span v-else-if="data.item.phase=='Reçu'" class="label label-success">Reçu</span>
                    <span v-else-if="data.item.phase=='En vente'" class="label label-info">En vente <span> à {{data.item.prix_vente}} </span> </span> 
                    <span v-else-if="data.item.phase=='Vendu'" class="label label-inverse">Vendu</span>
                    
                </template>
                <template v-slot:cell(Actions)="data">

                    <vs-button @click="notifyArrival(data.item.id)" v-if="data.item.phase=='En attente' && data.item.revente.etat=='Accepté'" color="primary" type="border" icon="meeting_room">
                        Réçu
                    </vs-button>
                    <vs-button @click="notReturn(data.item.id)" v-if="data.item.revente.etat=='Refusé' && data.item.phase=='Reçu' " color="primary" type="border" icon="logout">
                        Renvoyer
                    </vs-button>
                    <vs-button v-if="data.item.phase=='Reçu' && data.item.revente.etat=='Validé'"
                        @click="sellProduct(data.item)" 
                        color="success" type="border" icon="local_offer">
                        Vendre
                    </vs-button>
                    <button type="button" style="border-radius: 5%;" class="btn btn-info " 
                        @click="checkProduct(data.item)"
                        ><i class="ti-eye"></i>Consulter
                    </button>
                </template>
                </b-table>
                <vs-popup title="Gérer votre revente" :active.sync="returning">
                    <vs-alert  title="Commande a envoyer" active="true" color="warning" class="mb-3">
                        Commande confirmé, renseignez le numéro de suivie pour confirmer l'envoie.
                    </vs-alert>
                    <vs-input :danger="tracking == null "  class="inputx mb-4 col-11" placeholder="Numéro de suivie" v-model="tracking"/>
                    <vs-button @click="notifyReturn()" color="primary" type="filled">
                        Envoyer
                    </vs-button>
                </vs-popup>
                <vs-popup title="Gérer votre revente" :active.sync="salingProduct">
                        <div v-if="salingProduct" class="vs-list">
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Titre</div>
                                    <div class="vs-list--subtitle"> {{ productToSale.name }} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Acheté le :</div>
                                    <div class="vs-list--subtitle"> {{ productToSale.createdAt | formatDate }} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Couleur</div>
                                    <div class="vs-list--subtitle"> {{ productToSale.couleur }} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Age (mois)</div>
                                    <div class="vs-list--subtitle"> {{ productToSale.age }} </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Prix de rachat</div>
                                    <div class="vs-list--subtitle"> {{ productToSale.revente.prixPropose }} €  </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                            <div class="vs-list--item">
                                <div class="list-titles">
                                    <div class="vs-list--title">Modèle</div>
                                    <div class="vs-list--subtitle"> {{ productToSale.modele.name }}  </div>
                                </div>
                                <div class="vs-list--slot"></div>
                            </div>
                        </div>
                        <div class="default-input d-flex align-items-center mb-4">
                            <div class="col-1"></div>
                            <div class="vs-component vs-con-input-label vs-input inputx col-3 ml-4 vs-input-primary">
                                <label for="" class="vs-input--label">prix de vente </label>
                                <div class="vs-con-input">
                                    <input class="vs-inputx vs-input--input normal" type="text" 
                                        v-model="prixDeVente">
                                    <code v-if="$v.prixDeVente.$error" >Champ requis</code>
                                </div>
                            </div>
                            <div class="vs-component vs-con-input-label vs-input inputx col-3 ml-4 vs-input-primary">
                                <label for="" class="vs-input--label">Titre </label>
                                <div class="vs-con-input">
                                    <input class="vs-inputx vs-input--input normal" type="text" 
                                        v-model="nameDeVente">
                                    <code v-if="$v.nameDeVente.$error" >Champ requis</code>
                                </div>
                            </div>
                        </div>
                        <div >
                            <vs-button @click="putProductOnSale()" class="ml-5" color="rgb(3, 169, 243)" type="filled">
                                Mettre en vente
                            </vs-button>
                        </div>
                    
                </vs-popup>
                <vs-popup title="Détails du produit" :active.sync="showingProduct">
                    <prdcard v-if="showingProduct" :product="productOnShow"></prdcard>
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
                    {label: "Entrepot", key: "entrepot.name" },
                    {label: "Valeur (A)", key: "prixPropose" },
                    {label: "Phase", key: "phase" },
                        "Actions"],
            c_Page: 1,
            p_Page: 25,
            search:{
                selectedWarehouse: null,
                selectedPhase: null,
                selectedType: null,
                titre: null
            },
            isBusy: false,
            tRows: 0,
            productToSale: null,
            salingProduct: false,
            prixDeVente: null, 
            nameDeVente: null,
            showingProduct: false,
            productOnShow: null,
            typesCollection:[],
            phasesCollection: ['En attente', 'Reçu', 'Renvoyé', 'En vente', 'Vendu'],
            warehousesCollection: [],
            productsCollection: [],
            tracking: null,
            productToReturn : null,
            returning : false
        }
    },
    mounted() {
        axios.
            get('/categories/all').then( res => {
                 console.log( 'REs : ', res.data.rows)
                this.typesCollection = res.data.rows
            })
        axios.
            get('/warehouses/all').then( res => {
                 console.log( 'REs : ', res.data.rows)
                this.warehousesCollection = res.data.rows
            })
        this.loadData()
    },
    methods:{
        checkProduct(prd){
            this.showingProduct = true
            this.productOnShow = prd
        },
        notReturn(prd){
            this.productToReturn = prd
            this.returning = true
        },
        notifyReturn(){
            if(this.tracking){
                axios.put('product/return/'+ this.productToReturn , { tracking : this.tracking })
                    .then( res => {
                        this.returning = false
                        swal("Renvoie enregistré!",
                            "",
                            "success");
                        this.loadData()
                    }, err => {
                        this.returning = false
                        swal("Erreur!",
                            "Une erreur est survenue, veuillez contacter un administrateur",
                            "error");
                    })
            }   
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
                console.log(result)
                this.tRows = result.data.Products.length
                this.productsCollection = result.data.Products
                this.isBusy = false
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
            
        },
        sellProduct(product){
            this.salingProduct = true
            this.productToSale = product
            this.prixDeVente = (product.revente.prixPropose * 1.3).toFixed(0)
            this.nameDeVente = product.modele.name
            console.log( 'product :: ', product)
        },
        notifyArrival(id){
            //product/notifyarrival/
            axios.post('/product/notifyarrival/' + id )
                .then(result =>{
                        this.loadData()
                        this.$refs.productsList.refresh();
                        this.loadData()
                        swal("Récéption enregistré",
                                "Le marchand est notifié par mail, et sms.",
                                "success");
                    },error => {
                        swal("Erreur!",
                                "Une erreur est survenue",
                                "error");
                    }
                )
            //this.loadData()
            //this.$refs.productsList.refresh();
        },
        putProductOnSale(){
            axios.post('/product/sale/' + this.productToSale.id , {
                prix_vente : this.prixDeVente,
                name : this.nameDeVente
            } )
                .then(result =>{
                        this.loadData()
                        this.$refs.productsList.refresh();
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
            //this.loadData()
            //this.$refs.productsList.refresh();
        },
        filter(){
            
            this.loadData()
            this.$refs.productsList.refresh();
            
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
.label {
    border-radius: 100px;
}
</style>