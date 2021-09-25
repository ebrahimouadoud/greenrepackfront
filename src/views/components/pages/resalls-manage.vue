<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Revente'"
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
                <template v-slot:cell(created_at)="data">
                    {{ data.item.created_at | formatDate }}
                </template>
                <template v-slot:cell(status)="data">
                    
                    <span v-if="data.item.status" class="label label-success">Activé</span>
                    <span v-else class="label label-danger">Désactivé</span>
                    
                </template>
                <template v-slot:cell(Actions)="data">

                    <button type="button" class="btn btn-secondary btn-circle"
                        @click="switchStatus(data.item.id)"
                        ><i class="ti-key"></i> </button>
                    <button type="button" class="btn btn-secondary btn-circle"
                        @click="switchStatus(data.item.id)"
                        ><i class="ti-lock"></i> </button>
                    <button type="button" class="btn btn-secondary btn-circle" 
                        @click="goEdit(data.item.id)"
                        ><i class="ti-pencil-alt"></i> 
                    </button>
                    <button type="button" class="btn btn-secondary btn-circle"  ><i class="ti-archive" ></i> </button>
                    
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
                    {label: "role", key: "role" },
                    {label: "Créateur", key: "name" },
                    {label: "Date de création", key: "created_at" },
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
    methods:{
        loadData(ctx, callback){
            console.log("loading")
            /*
            axios.get('/api/users'+"?page=" + this.c_Page + "&ppage=" + this.p_Page + "&srch=" + this.tSearch )
            .then( result => {
                console.log(result)
                this.tRows = result.data.meta.total
                callback(result.data.data)
                this.isBusy = false
            }, error =>{
                swal("Erreur!",
                        "Une erreur est survenue, veuillez contacter un administrateur",
                        "error");
            }  )
            */
        },
        switchStatus(id){
            console.log("switching status of user with id: ", id)
            /*axios.put('api/users/switchstatus/' + id )
                .then(result =>{
                        console.log(result)
                    },error => {
                        console.log(error)
                    }
                )
            this.$refs.userstab.refresh();*/
        },
        goEdit(id){
            /*
            this.$router.push('/user/edit/'+ id )*/
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