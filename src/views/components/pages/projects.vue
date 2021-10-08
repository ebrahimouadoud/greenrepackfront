<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Projet'" 
                :crlink="'#/user/create'"
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
                    ref="userstab"
                    :items="projectsCollection"
                    :busy="isBusy"
                    :fields="fields"
                    class="mt-3"
                    :per-page="p_Page"
                    :filter="search"
                    :current-page="c_Page"
                    outlined>
                <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Chargement...</strong>
                    </div>
                </template>
                
                <template v-slot:cell(createdAt)="data">
                    {{ data.item.createdAt | formatDate }}
                </template>
                <template v-slot:cell(budget)="data">
                    {{ data.item.budgetAttendu + " €" }}
                </template>
                <template v-slot:cell(status)="data">
                    
                    <span v-if="data.item.status=='En attente'" style="border-radius: 0px;" class="label label-warning">En attente</span>
                    <span v-else-if="data.item.status=='Refusé'" style="border-radius: 0px;" class="label label-danger">Refusé</span>
                    <span v-else-if="data.item.status=='Validé'" style="border-radius: 0px;" class="label label-info">Validé</span>
                    <span v-else style="border-radius: 0px;" class="label label-success">Prie en charge</span>
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
            </div>
        </div>
    </div>
</template>
<script>
import ThemifyIcon from "vue-themify-icons";
import brc from '../custom/breadc.vue'
import axios from 'axios';
/* eslint-disable */
export default {
    components: {
        ThemifyIcon,
        brc
    },
    data(){
        return{
            fields: [ {label: "Nom", key :"name"  },
                    {label: "Association", key: "association.name" },
                    {label: "Date de création", key: "createdAt" },
                    {label: "Budget", key: "budget" },
                    {label: "Status", key: "status" },
                        ],
            c_Page: 1,
            p_Page: 5,
            search:'',
            tSearch: '',
            isBusy: false,
            tRows: 0,
            projectsCollection : []
        }
    },
    mounted(){
        this.loadData()
    },
    methods:{
        loadData(ctx, callback){
            console.log("loading")
            axios.get('projects/all' )
            .then( result => {
                console.log(result.data.Projects)
                this.tRows = result.data.Projects.length
                this.projectsCollection = result.data.Projects
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
        },
        filter(){
            this.tSearch = this.search
            this.c_Page = 1
        },
    }
}
</script>

<style>
.card {
    border-radius: 0;
}
</style>