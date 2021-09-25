<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Utilisateur'" 
                :crlink="'#/user/create'"
                :ope="'Gestion'" 
                :showbtn="true">
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
                <template v-slot:cell(createdAt)="data">
                    {{ data.item.createdAt | formatDate }}
                </template>
                <template v-slot:cell(status)="data">
                    
                    <span v-if="data.item.status=='Active'" class="label label-success">Activé</span>
                    <span v-else class="label label-danger">Bloqué</span>
                    
                </template>
                <template v-slot:cell(Actions)="data">

                    <button type="button" style="border-radius: 100%;" class="btn btn-warning btn-circle"
                        @click="switchStatus(data.item.id)"
                        ><i :class="data.item.status == 'Active' ? 'ti-lock' : 'ti-unlock' "></i> </button>
                    <button type="button" style="border-radius: 100%;" class="btn btn-info btn-circle" 
                        @click="goEdit(data.item.id)"
                        ><i class="ti-pencil-alt"></i> 
                    </button>
                    <button type="button" style="border-radius: 100%;" class="btn btn-danger btn-circle" 
                        @click="deleteUser(data.item.id)"
                     ><i class="ti-trash" ></i> </button>
                    
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
            fields: [ {label: "Nom complet", key :"name"  },
                    {label: "Adresse mail", key: "email" },
                    {label: "role", key: "roles[0].name" },
                    {label: "Créateur", key: "name" },
                    {label: "Date de création", key: "createdAt" },
                    {label: "Status", key: "status" },
                        "Actions"],
            c_Page: 1,
            p_Page: 5,
            search:'',
            tSearch: '',
            isBusy: false,
            tRows: 0,
          
        }
    },
    mounted(){
        //this.loadData()
    },
    methods:{
        loadData(ctx, callback){
            console.log("loading")
            axios.get('/users/all'+"?page=" + this.c_Page + "&ppage=" + this.p_Page + "&srch=" + this.tSearch )
            .then( result => {
                console.log(result.data.rows)
                this.tRows = result.data.total
                callback(result.data.rows)
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
        },
        switchStatus(id){
            console.log("switching status of user with id: ", id)
            axios.put('/user/toggleActivation/' + id )
                .then(result =>{
                        swal("",
                            "Changé avec succés.",
                            "success");
                        this.$refs.userstab.refresh();
                    },error => {
                        swal("Erreur!",
                            "Une erreur est survenue, veuillez contacter un administrateur",
                            "error");
                    }
                )
        },
        goEdit(id){
            /*
            this.$router.push('/user/edit/'+ id )*/
        },
        deleteUser(id){
            axios.delete('/user/' + id )
                .then(result =>{
                        this.$refs.userstab.refresh();
                        swal("",
                            "Supprimé avec succés.",
                            "success");
                    },error => {
                        swal("Erreur!",
                            "Une erreur est survenue, veuillez contacter un administrateur",
                            "error");
                    }
                )
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