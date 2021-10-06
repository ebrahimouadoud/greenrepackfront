<template>
    <div>
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
                    <button type="button" @click="add_Model()" class="btn btn-secondary">
                        <ThemifyIcon icon="plus" />  Nouveau modele
                    </button>
                </div>
            </div>
        </div>
        <b-table
            ref="modelstab"
            :items="modelsCollection"
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
        <vs-popup title="Ajouter un nouveau modele." :active.sync="addingModele">
            <div class="vs-component vs-con-input-label vs-input inputx col-4 ml-4 vs-input-primary">
                <label for="" class="vs-input--label">Marque</label>
                <div class="vs-con-input">
                    <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.newModel.selectedBrand.$error }"
                        v-model="newModel.selectedBrand">
                        <b-form-select-option :value="null">Choisir la marque</b-form-select-option>
                        <option v-for="option in brandsCollection" :value="option" :key="option.id">
                            {{ option.name }}
                        </option>
                    </b-form-select>
                </div>
            </div>
            <div class="vs-component vs-con-input-label vs-input inputx col-4 ml-4 vs-input-primary">
                <label for="" class="vs-input--label">Type</label>
                <div class="vs-con-input">
                    <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.newModel.selectedType.$error }"
                        v-model="newModel.selectedType">
                        <b-form-select-option :value="null">Choisir la marque</b-form-select-option>
                        <option v-for="option in typeCollection" :value="option" :key="option.id">
                            {{ option.name }}
                        </option>
                    </b-form-select>
                </div>
            </div>
            <vs-alert  title="Commande a envoyer" active="true" color="warning" class="mb-3">
                Renseignez le type
            </vs-alert>
            <vs-input :danger="$v.newModel.name.$error"  class="inputx mb-4 col-11" placeholder="Nom" v-model="newModel.name"/>
            <vs-input :danger="$v.newModel.number.$error"  class="inputx mb-4 col-11" placeholder="Numéro" v-model="newModel.number"/>
            <vs-button @click="saveModel()" color="success" icon="save" type="filled">
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
                        { label : 'Numéro', key:'number' }, 
                        { label : 'Type', key:'type.name' },
                        { label : 'Marque', key:'brand.name' }
                        ],
            c_Page: 1,
            p_Page: 5,
            search:'',
            tSearch: '',
            isBusy: true,
            tRows: 0,
            modelsCollection: [],
            typeCollection: [],
            brandsCollection: [],
            addingModele: false,
            newModel:{
                name: null,
                number: null,
                selectedType: null,
                selectedBrand: null
            },
        }
    },
    mounted() {
        this.loadModels()
    },
    methods:{
        add_Model(){
            this.loadTypes()
            this.loadBrands()
            this.addingModele = true
            this.newModel.name = null
            this.newModel.number = null
            this.newModel.selectedType = null
            this.newModel.selectedBrand = null
        },
        loadModels(){
            console.log("loading")
            
            axios.get('model/all' )
            .then( result => {
                console.log(result.data.rows)
                this.modelsCollection = result.data.rows
                this.tRows = result.data.rows.length
                this.isBusy = false
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
            
        },
        loadTypes(){
            console.log("loading")
            
            axios.get('/categories/all' )
            .then( result => {
                console.log(result.data.rows)
                this.typeCollection = result.data.rows
                this.tRows = result.data.rows.length
                this.isBusy = false
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
            
        },
        loadBrands(){
            console.log("loading")
            
            axios.get('/brand/all' )
            .then( result => {
                console.log(result.data.rows)
                this.brandsCollection = result.data.rows
                this.tRows = result.data.rows.length
                this.isBusy = false
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
            
        },
        saveModel(){
            this.$v.$touch()
            if(! this.$v.$invalid){
                axios.post('model/new', {
                    name: this.newModel.name,
                    number: this.newModel.number,
                    typeId: this.newModel.selectedType.id,
                    brandId: this.newModel.selectedBrand.id
                } )
                    .then(result =>{
                            console.log(result)
                            this.addingModele = false
                            this.newModel.name = null
                            this.newModel.number = null
                            this.newModel.selectedType = null
                            this.newModel.selectedBrand = null
                            this.loadModels()
                            swal("Marque enregistré!",
                                "",
                                "success");
                        },error => {
                            console.log(error)
                            this.addingModele = false
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
        newModel: {
            name: {
                required
            },
            number: {
                required
            },
            selectedType: {
                required,
            },
            selectedBrand: {
                required,
            }
        }
    }
}
</script>
