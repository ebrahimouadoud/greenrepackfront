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
                    <button type="button" @click="addingType = true" class="btn btn-secondary">
                        <ThemifyIcon icon="plus" />  Nouveau type
                    </button>
                </div>
            </div>
        </div>
        <b-table
            ref="typestab"
            :items="typeCollection"
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
        <vs-popup title="Ajouter un nouveau type" :active.sync="addingType">
            <vs-alert  title="Commande a envoyer" active="true" color="warning" class="mb-3">
                Renseignez le nom du type
            </vs-alert>
            <vs-input :danger="$v.newTypeName.$error"  class="inputx mb-4 col-11" placeholder="Nom du type" v-model="newTypeName"/>
            <vs-button @click="saveType()" color="success" icon="save" type="filled">
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
            fields: [ {label: "Nom", key :"name"  } ],
            c_Page: 1,
            p_Page: 5,
            search:'',
            tSearch: '',
            isBusy: true,
            tRows: 0,
            typeCollection: [],
            addingType: false,
            newTypeName: null
        }
    },
    mounted() {
        this.loadTypes()
    },
    methods:{
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
        saveType(){
            this.$v.$touch()
            if(!this.$v.$invalid){
                axios.post('categories/new', {
                    name: this.newTypeName
                } )
                    .then(result =>{
                            console.log(result)
                            this.loadTypes()
                            this.addingType = false
                            this.newTypeName = null
                            swal("Marque enregistré!",
                                "",
                                "success");
                        },error => {
                            console.log(error)
                            this.addingType = false
                            this.newTypeName = null
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
        newTypeName: {
          required
        }
    }
}
</script>
