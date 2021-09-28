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
                <b-table
                    ref="productsList"
                    :items="loadData"
                    :busy="isBusy"
                    :fields="fields"
                    class="mt-3"
                    :per-page="p_Page"
                    :filter="tSearch"
                    :current-page="c_Page"
                    outlined>
                <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Chargement...</strong>
                    </div>
                </template>
                <template v-slot:cell(prixPropose)="data">
                    {{ data.item.revente.prixPropose + "€" }} 
                </template>
                <template v-slot:cell(phase)="data">
                    
                    <span v-if="data.item.phase=='En Attend' && (data.item.revente.etat=='En Attendant' || data.item.revente.etat=='Accepté')" class="label label-warning">En attente</span>
                    <span v-else-if="data.item.revente.etat=='Refusé'" class="label label-danger">Revente refusé</span>
                    <span v-else-if="data.item.phase=='Reçu'" class="label label-success">Reçu</span>
                    <span v-else-if="data.item.phase=='Renvoyé'" class="label label-danger">Renvoyé</span>
                    <span v-else-if="data.item.phase=='En vente'" class="label label-info">En vente <span> à {{data.item.prix_vente}} </span> </span> 
                    <span v-else-if="data.item.phase=='Vendu'" class="label label-inverse">Vendu</span>
                    
                </template>
                <template v-slot:cell(Actions)="data">

                    <vs-button @click="notifyArrival(data.item.id)" v-if="data.item.phase=='En Attend' && data.item.revente.etat=='Accepté'" color="primary" type="border" icon="meeting_room">
                        Réçu
                    </vs-button>
                    <vs-button v-if="data.item.phase=='Reçu' && data.item.revente.etat=='Validé'"
                        @click="sellProduct(data.item)" 
                        color="success" type="border" icon="local_offer">
                        Vendre
                    </vs-button>
                    
                </template>
                </b-table>
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
            p_Page: 5,
            search:'',
            tSearch: '',
            isBusy: false,
            tRows: 0,
            productToSale: null,
            salingProduct: false,
            prixDeVente: null, 
            nameDeVente: null
        }
    },
    methods:{
        loadData(ctx, callback){
            console.log("loading")
            
            axios.get('/products/all' )
            .then( result => {
                console.log(result)
                this.tRows = result.data.Products.length
                callback(result.data.Products)
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
                        this.$refs.productsList.refresh();
                        swal("Récéption enregistré",
                                "Le marchand est notifié par mail, et sms.",
                                "success");
                    },error => {
                        swal("Erreur!",
                                "Une erreur est survenue",
                                "error");
                    }
                )
            this.$refs.productsList.refresh();
        },
        putProductOnSale(){
            axios.post('/product/sale/' + this.productToSale.id , {
                prix_vente : this.prixDeVente,
                name : this.nameDeVente
            } )
                .then(result =>{
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
            this.$refs.productsList.refresh();
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