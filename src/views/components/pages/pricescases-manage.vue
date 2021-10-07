<template>
    <div>
        <div class="row">
            <div class="col-sm-12 col-md-8">
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
            <div class="col-sm-12 col-md-2">
                <div id="example_filter" class="dataTables_filter">
                    <label>Filtrer: 
                        <input type="text" v-model="tSearch" placeholder="Numéro de modele">
                    </label>
                </div>
            </div>
            <div class="col-sm-12 col-md-2">
                <div id="example_filter" class="dataTables_filter">
                    <div id="example_filter" class="dataTables_filter">
                    <button type="button" @click="addPrice()" class="btn mt-3 btn-secondary">
                        <ThemifyIcon icon="plus" />  Nouveau prix
                    </button>
                </div>
                </div>
            </div>
        </div>
        <b-table
            ref="pricestab"
            :items="pricesCollection"
            :busy="isBusy"
            :fields="fields"
            class="mt-3"
            :per-page="p_Page"
            :filter="tSearch"
            :current-page="c_Page"
            @filtered="onFiltered"
            outlined>
        <template v-slot:table-busy>
            <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Chargement...</strong>
            </div>
        </template>
        <template v-slot:cell(price)="data">
            <input type="number" class="col-5" v-model="data.item.price" >
        </template>
        <template v-slot:cell(Modifier)="data">
            <button type="button" @click="saveNewPrice(data.item)" class="btn btn-success btn-circle">
                <i class="ti-save"></i> 
            </button>
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
        <vs-popup title="Ajouter un nouveau modele." :active.sync="addingPrice">
            <div class="vs-component vs-con-input-label vs-input inputx col-4 ml-4 vs-input-primary">
                <label for="" class="vs-input--label">Marque</label>
                <div class="vs-con-input">
                    <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.selectedModel.$error }"
                        v-model="selectedModel">
                        <b-form-select-option :value="null">Choisir le modele</b-form-select-option>
                        <option v-for="option in modelsCollection" :value="option" :key="option.id">
                            {{ option.name }}
                        </option>
                    </b-form-select>
                </div>
            </div>
            <div v-if="selectedModel && selectedModel.type.name == 'téléphone' " class="default-input d-flex align-items-center mb-4">
                <div class="vs-component vs-con-input-label vs-input inputx col-3 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.phone.state_screen.$error }">
                    <label for="" class="vs-input--label">Etat de l'écran </label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.phone.state_screen.$error }"
                            :options='["comme_neuf", "bonne_état", "abimé", "cassé" ]' type="date" v-model="phone.state_screen">
                            <b-form-select-option :value="null">Choisissez</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>
                
                <div class="vs-component vs-con-input-label vs-input inputx col-3 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.phone.state_body.$error}">
                    <label for="" class="vs-input--label">Etat de la coque</label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.phone.state_body.$error }"
                            :options='["comme_neuf", "bonne_état", "abimé", "cassé" ]' v-model="phone.state_body">
                            <b-form-select-option :value="null">Choisissez</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>
                
                <div class="vs-component vs-con-input-label vs-input inputx col-3 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.phone.simBlocked.$error }">
                    <label for="" class="vs-input--label">Sim débloqué ? </label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal"
                            :class="{ 'is-invalid' : $v.phone.simBlocked.$error }" 
                            :options='[{value: 1, text: "Oui"}, {value: 0, text: "Non"} ]' v-model="phone.simBlocked">
                            <b-form-select-option :value="null">Choisissez</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>
                <div class="vs-component vs-con-input-label vs-input inputx col-3 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.phone.storage.$error }">
                    <label for="" class="vs-input--label">Stockage (GO) </label>
                    <div class="vs-con-input">
                        <input :class="{ 'is-invalid' : $v.phone.storage.$error }" class="vs-inputx vs-input--input normal" type="number"
                             v-model="phone.storage">
                        </div>
                </div>
                <div class="vs-component vs-con-input-label vs-input inputx col-3 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.priceToAdd.$error }">
                    <label for="" class="vs-input--label">Prix </label>
                    <div class="vs-con-input">
                        <input :class="{ 'is-invalid' : $v.priceToAdd.$error }" class="vs-inputx vs-input--input normal" type="number"
                             v-model="priceToAdd">
                        </div>
                </div>
            </div>
            <div v-if="selectedModel && selectedModel.type.name == 'ordinateur portable' " class="default-input d-flex align-items-center mb-4">

                <div class="vs-component vs-con-input-label vs-input inputx col-2 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Etat</label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.laptop.condition.$error }"
                            :options='["comme_neuf", "bonne_état", "abimé", "cassé" ]' type="date" v-model="laptop.condition">
                            <b-form-select-option :value="null">Choisissez</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>
                
                <div class="vs-component vs-con-input-label vs-input inputx col-2 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Clavier</label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.laptop.Clavier.$error }"
                            :options='["AZERTY", "QWERTY" ]' v-model="laptop.Clavier">
                            <b-form-select-option :value="null">Choisissez</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>
                <div class="vs-component vs-con-input-label vs-input inputx col-2 ml-4 vs-input-primary" 
                    :class="{ 'input-icon-validate-danger' : $v.laptop.Processeur.$error }">
                    <label for="" class="vs-input--label">Processeur </label>
                    <div class="vs-con-input">
                        <input class="vs-inputx vs-input--input normal" type="text"
                             v-model="laptop.Processeur">
                        </div>
                </div>
                <div class="vs-component vs-con-input-label vs-input inputx col-2 ml-4 vs-input-primary"
                    :class="{ 'input-icon-validate-danger' : $v.laptop.Taille_ecran.$error }"
                >
                    <label for="" class="vs-input--label">Taille</label>
                    <div class="vs-con-input">
                        <input  class="vs-inputx vs-input--input normal" type="number"
                            v-model="laptop.Taille_ecran">
                        </div>
                </div>
                <div class="vs-component vs-con-input-label vs-input inputx col-2 ml-4 vs-input-primary"
                    :class="{ 'input-icon-validate-danger' : $v.laptop.RAM.$error }"
                >
                    <label for="" class="vs-input--label">RAM (GO) </label>
                    <div class="vs-con-input">
                        <input class="vs-inputx vs-input--input normal" type="number"
                             v-model="laptop.RAM">
                        </div>
                </div>
                <div class="vs-component vs-con-input-label vs-input inputx col-2 ml-4 vs-input-primary"
                    :class="{ 'input-icon-validate-danger' : $v.laptop.storage.$error }"
                >
                    <label for="" class="vs-input--label">Stockage (GO) </label>
                    <div class="vs-con-input">
                        <input :class="{ 'is-invalid' : $v.laptop.storage.$error }" class="vs-inputx vs-input--input normal" type="number"
                             v-model="laptop.storage">
                        </div>
                </div>
                <div class="vs-component vs-con-input-label vs-input inputx col-3 ml-4 vs-input-primary" 
                    :class="{ 'input-icon-validate-danger' : $v.priceToAdd.$error }"
                >
                    <label for="" class="vs-input--label">Prix </label>
                    <div class="vs-con-input">
                        <input :class="{ 'is-invalid' : $v.priceToAdd.$error }" class="vs-inputx vs-input--input normal" type="number"
                             v-model="priceToAdd">
                        </div>
                </div>
            </div>
            
            <vs-button @click="savePrice()" color="success" icon="save" type="filled">
                Envoyer
            </vs-button>
        </vs-popup>
    </div>
</template>

<script>
import ThemifyIcon from "vue-themify-icons";
import brc from '../custom/breadc.vue'
import axios from 'axios';
import { required, requiredIf } from 'vuelidate/lib/validators'
/* eslint-disable */
export default {
    components: {
        ThemifyIcon,
        brc
    },
    data(){
        return{
            fields: [
                        { label : 'Numéro de molde', key:'modelId' }, 
                        { label : 'Etat', key:'state' },
                        { label : 'Prix', key:'price' },
                        "Modifier"
                        ],
            c_Page: 1,
            p_Page: 5,
            search:'',
            tSearch: '',
            isBusy: true,
            tRows: 0,
            pricesCollection: [],
            addingPrice: false,
            modelsCollection: [],
            selectedModel: null,
            addingModele: false,
            priceToAdd: null,
            phone: {
                state_screen: null,
                state_body:null,
                simBlocked:null,
                storage:null,
            },
            laptop: {
                    storage: null,
                    RAM: null,
                    Taille_ecran: null,
                    Processeur: null,
                    Clavier: null,
                    condition: null
                },
        }
    },
    mounted() {
        this.loadPrices()
    },
    methods:{
        addPrice(){
            this.addingPrice = true
            this.loadModels()
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
        savePrice(){
            this.$v.$touch()
            console.log(this.$v)
            console.log( ' this.$v.$invalid ::: ', this.$v.$invalid)
            console.log( ' selectedModel ::: ', this.selectedModel.type)
            console.log( 'selectedModel.type.name ', this.selectedModel.type.name )
            var _stt = null
            if( this.selectedModel.type.name == 'téléphone' || this.selectedModel.type.name == 'tablette' ){
                _stt = this.phone
            }
            if( this.selectedModel.type.name == 'ordinateur portable' ){
                _stt = this.laptop
            }
            console.log( ' ::: _stt ::: ', _stt)
            axios.post("/prices", {
                    name: this.selectedModel.number,
                    state: _stt,
                    price: this.priceToAdd
                })
                .then(res => {
                    swal("Enregistré !",
                            "Le prix est enregistré avec succès.",
                            "success");
                    this.selectedModel = null
                    this.priceToAdd = null
                    this.addingPrice = false
                    console.log( res)
                }, err => {
                    swal("Error !",
                            "",
                            "error");
                } )
            
        },
        saveNewPrice(pc){
            console.log(" :::: Price :::: " , pc )
            axios.put('prices/' + pc.id, {
                price: pc.price
                } )
                .then( res => {
                    console.log(res)
                    this.loadPrices()
                    swal("Enregistré !",
                            "Le prix est modifié avec succès.",
                            "success");
                }, err => {
                    swal("Erreur !",
                            "Une erreur s'est produit.",
                            "error");
                })
        },
        onFiltered(filteredItems) {
            this.tRows = filteredItems.length
            this.currentPage = 1
        },
        loadPrices(){
            console.log("loading")
            
            axios.get('prices/all' )
                .then( result => {
                    this.pricesCollection = result.data.rows
                    this.tRows = result.data.rows.length
                    this.isBusy = false
                }, error =>{
                    swal("Erreur!",
                            "Une erreur est survenue, veuillez contacter un administrateur",
                            "error");
                }  )
            
        },
    },
    validations: {
        selectedModel: { 
            required 
        },
        priceToAdd: {
            required
        },
        phone: {
            state_screen: {required : requiredIf(function () {
                return this.selectedModel.type.name == 'téléphone' || this.selectedModel.type.name == 'tablette' })},
            state_body:{ required : requiredIf(function () {
                return this.selectedModel.type.name == 'téléphone' || this.selectedModel.type.name == 'tablette' })},
            simBlocked:{required : requiredIf(function () {
                return this.selectedModel.type.name == 'téléphone' || this.selectedModel.type.name == 'tablette' })},
            storage:{required : requiredIf(function () {
                return this.selectedModel.type.name == 'téléphone' || this.selectedModel.type.name == 'tablette' })}
        },
        laptop: {
                storage: {required: requiredIf(function () {
                return this.selectedModel.type.name == 'ordinateur portable' })},
                RAM: {required: requiredIf(function () {
                return this.selectedModel.type.name == 'ordinateur portable' })},
                Taille_ecran: {required: requiredIf(function () {
                return this.selectedModel.type.name == 'ordinateur portable' })},
                Processeur: {required: requiredIf(function () {
                return this.selectedModel.type.name == 'ordinateur portable' })},
                Clavier: {required: requiredIf(function () {
                return this.selectedModel.type.name == 'ordinateur portable' })},
                condition: {required: requiredIf(function () {
                return this.selectedModel.type.name == 'ordinateur portable' })}
            },
    },
    
}
</script>
<style>
.table th, .table td {
    max-width: 400px;
    }
</style>