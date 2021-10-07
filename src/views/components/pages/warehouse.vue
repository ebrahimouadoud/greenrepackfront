<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Entrepot'" 
                :crlink="'#/resall/new'"
                :ope="'Gestion'" 
                :showbtn="false">
            </brc>
        </div>
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
                    <button type="button" @click="addWarehouse()" class="btn btn-secondary">
                        <ThemifyIcon icon="plus" />  Nouveau entrepot
                    </button>
                </div>
            </div>
        </div>
        <b-table
            ref="warehousestab"
            :items="wareHousesCollection"
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
        </b-table>
        <div class="mt-3">
            <b-pagination
                v-model="c_Page"
                :total-rows="tRows"
                :per-page="p_Page"
                aria-controls="my-table"
            ></b-pagination>
        </div>
        <vs-popup title="Ajouter un nouveau entrepot." :active.sync="addingWarehouse">
            <vs-alert  title="Commande a envoyer" active="true" color="warning" class="mb-3">
                Renseignez le type
            </vs-alert>
            <vs-input :danger="$v.newWarehouse.name.$error"  class="inputx mb-4 col-11" placeholder="Nom" v-model="newWarehouse.name"/>
            <vs-input :danger="$v.newWarehouse.adresse.$error"  class="inputx mb-4 col-11" placeholder="Adresse" v-model="newWarehouse.adresse"/>
            <div v-if="formattedAdress" style="border-radius: 155px;" class="alert alert-success alert-rounded alert-dismissible row"> 
                <i class="ti-check"></i> {{formattedAdress}}
            </div>
            <vs-button @click="verifyAdress"  color="success" icon="search" type="filled">
                Vérifier l'adresse
            </vs-button>
            <vs-button :disabled="!formattedAdress" @click="saveWarehouse()" class=" mr-5 ml-5" color="success" icon="save" type="filled">
                Envoyer
            </vs-button>
        </vs-popup>
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
                        {label: "Nom", key :"name"  }, 
                        { label : 'Adresse', key:'adresse' }, 
                        { label : 'Disponibilité', key:'disponibilite' },
                        { label : 'Stoque', key:'produits.length' }
                        ],
            c_Page: 1,
            p_Page: 5,
            search:'',
            tSearch: '',
            isBusy: true,
            tRows: 0,
            wareHousesCollection: [],
            addingWarehouse: false,
            formattedAdress: null,
            newWarehouse:{
                name: null,
                adresse: null
            },
        }
    },
    mounted() {
        this.loadModels()
    },
    methods:{
        verifyAdress(){
            if( ! this.newWarehouse.adresse  ){

            }else{
                axios.get('checkadresse?adresse=' + this.newWarehouse.adresse)
                    .then( res => {
                        console.log(res.data)
                        this.formattedAdress = res.data
                        this.newWarehouse.adresse = res.data
                    }, err => {
                        this.notValidAdresse = true
                    } )
            }
        },
        addWarehouse(){
            this.addingWarehouse = true
            this.newWarehouse.name = null
            this.newWarehouse.adresse = null
        },
        loadModels(){
            console.log("loading")
            
            axios.get('warehouses/all' )
            .then( result => {
                console.log(result.data.rows)
                this.wareHousesCollection = result.data.rows
                this.tRows = result.data.rows.length
                this.isBusy = false
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
            
        },
        saveWarehouse(){
            this.$v.$touch()
            if(! this.$v.$invalid){
                axios.post('warehouses/new', {
                    name: this.newWarehouse.name,
                    adresse: this.newWarehouse.adresse
                } )
                    .then(result =>{
                            console.log(result)
                            this.addingWarehouse = false
                            this.newWarehouse.name = null
                            this.newWarehouse.adresse = null
                            this.newWarehouse.selectedType = null
                            this.newWarehouse.selectedBrand = null
                            this.loadModels()
                            swal("Entrepot enregistré!",
                                "",
                                "success");
                        },error => {
                            console.log(error)
                            this.addingWarehouse = false
                            swal("Erreur!",
                                "Merci de réessayer ou contacter un administrateur.",
                                "error");
                        }
                    )
            }
        },
        filter(){
            this.tSearch = this.search
            this.c_Page = 1
        },
    },
    validations: {
        newWarehouse: {
            name: {
                required
            },
            adresse: {
                required
            }
        }
    }
}
</script>
