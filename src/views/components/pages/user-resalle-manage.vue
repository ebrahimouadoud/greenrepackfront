<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Revente'" 
                :crlink="'#/resall/new'"
                :ope="'Mes reventes'" 
                :showbtn="true">
            </brc>
        </div>

        <div class="card">
            <div class="card-body">
                <b-table
                    ref="resalls"
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
                    {{ data.item.prixPropose + "€" }}
                </template>
                <template v-slot:cell(createdAt)="data">
                    {{ data.item.createdAt | formatDate }}
                </template>
                <template v-slot:cell(etat)="data">
                    
                    <span v-if="data.item.etat=='En Attendant'" class="label label-warning">En attente</span>
                    <span v-else-if="data.item.etat=='Validé'" class="label label-success">Validé</span>
                    <span v-else-if="data.item.etat=='Refusé'" class="label label-danger">Refusé</span>
                    <span v-else-if="data.item.etat=='Accepté'" class="label label-info">Accepté</span>
                    
                </template>
                <template v-slot:cell(Gérer)="data">

                    <button :disabled="data.item.etat=='Refusé' || data.item.etat=='Validé'" type="button" style="border-radius: 5%;" class="btn btn-info " 
                        @click="manageResall(data.item)"
                        ><i class="ti-eye"></i> 
                    </button>
                    
                </template>
                </b-table>    
                <vs-popup title="Gérer votre revente" :active.sync="managingResall">
                    <div v-if="managingResall">
                        <vs-alert v-if="resallOnManage.etat=='En Attendant'"  title="En Attente" active="true" color="warning" class="mb-3">
                            La revente est en attente vous pouvez accepté ou refuser.
                        </vs-alert>
                        <div v-if="resallOnManage.etat=='En Attendant'" >
                            <vs-button @click="acceptResall(resallOnManage.id)" class="ml-5" color="success" type="filled">Accepter</vs-button>
                            <vs-button @click="refuseResall(resallOnManage.id)" class="ml-5" color="danger" type="filled">Refuser</vs-button>
                        </div>
                        <p v-if="resallOnManage.etat=='Accepté'" >
                            <vs-alert title="Accepté" active="true" color="rgb(41, 147, 138)" class="mb-3">
                                Vous avez accepté la revente, vous allez être informé lors de la récéption.
                            </vs-alert>
                        </p>
                    </div> 
                </vs-popup>
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
            fields: [ 
                    {label: "Date et heure", key: "createdAt" },
                    {label: "Prix", key :"prixPropose"  },
                    {label: "Status", key: "etat" },
                        "Gérer"],
            c_Page: 1,
            p_Page: 5,
            search:'',
            tSearch: '',
            isBusy: false,
            tRows: 0,
            managingResall: false,
            resallOnManage: null
        }
    },
    mounted(){
        //this.loadData()
    },
    watch:{
        managingResall: function (val, newVal) {
            console.log(' newVal, val :: ', newVal , val)
        }
    },
    methods:{
        loadData(ctx, callback){
            console.log("loading")
            axios.get('/resall/all' )
            .then( result => {
                console.log(result.data.Resall)
                this.tRows = result.data.total
                callback(result.data.Resall)
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
                        this.$refs.resalls.refresh();
                    },error => {
                        swal("Erreur!",
                            "Une erreur est survenue, veuillez contacter un administrateur",
                            "error");
                    }
                )
        },
        manageResall(item){
            this.managingResall = true
            this.resallOnManage = item 
        },
        deleteUser(id){
            axios.delete('/user/' + id )
                .then(result =>{
                        this.$refs.resalls.refresh();
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
        acceptResall(id){
            console.log(' ACCEPT :: ', id)
            axios.put('/resall/proposal/accept/' + id )
                .then(result =>{
                        swal("",
                            "Acceptée.",
                            "success");
                        this.$refs.resalls.refresh();
                        this.managingResall = false
                        this.resallOnManage = null 
                    },error => {
                        swal("Erreur!",
                            "Une erreur est survenue, veuillez contacter un administrateur",
                            "error");
                    }
                )
        },
        refuseResall(id){
            console.log(' REFUSE :: ', id)
            axios.put('/resall/proposal/refuse/' + id )
                .then(result =>{
                        swal("",
                            "Acceptée.",
                            "success");
                        this.$refs.resalls.refresh();
                        this.managingResall = false
                        this.resallOnManage = null 
                    },error => {
                        swal("Erreur!",
                            "Une erreur est survenue, veuillez contacter un administrateur",
                            "error");
                    }
                )
        }
    }
}
</script>

<style>
.card {
    border-radius: 0;
}
</style>