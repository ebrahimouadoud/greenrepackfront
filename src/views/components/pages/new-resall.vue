<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Revente'" 
                :ope="'Nouvelle revente'"
                :showbtn="false" >
            </brc>
        </div>
        <vs-card>
            <div class="default-input d-flex align-items-center mb-4">
                <div class="col-1"></div>
                
                <div class="vs-component vs-con-input-label vs-input inputx col-4 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Type du produit</label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal" v-model="selectedType">
                            <b-form-select-option :value="null">Choisir le type du produit</b-form-select-option>
                            <option v-for="option in typesCollection" :value="option" :key="option.id">
                                {{ option.name }}
                            </option>
                        </b-form-select>
                    </div>
                </div>
                <div v-if="selectedType" class="vs-component vs-con-input-label vs-input inputx col-4 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Marque</label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.selectedBrand.$error }"
                            v-model="selectedBrand">
                            <b-form-select-option :value="null">Choisir la marque</b-form-select-option>
                            <option v-for="option in brandsCollection" :value="option" :key="option.id">
                                {{ option.name }}
                            </option>
                        </b-form-select>
                    </div>
                </div>
            </div>
            <div class="default-input d-flex align-items-center mb-4">
                <div class="col-1"></div>
                <div v-if="selectedBrand" class="vs-component vs-con-input-label vs-input inputx col-8 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Modele</label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.selectedModel.$error }"
                            :options="modelsCollection" value-field="id" text-field="name" type="date" v-model="selectedModel">
                            <b-form-select-option :value="null">Choisir un modele</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>
            </div>
            <div v-if="selectedModel" class="default-input d-flex align-items-center mb-4" :class="{ 'input-icon-validate-danger' : $v.color.$error }">
                <div class="col-1"></div>
                <div class="vs-component vs-con-input-label vs-input inputx col-3 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Couleur </label>
                    <div class="vs-con-input">
                        <input class="vs-inputx vs-input--input normal" type="text" 
                             v-model="color">
                        <code v-if="$v.color.$error" >Champ requis</code>
                    </div>
                </div>
                <div class="col-1"></div>
                <div class="vs-component vs-con-input-label vs-input inputx col-3 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.age.$error }">
                    <label for="" class="vs-input--label">Age (mois) </label>
                    <div class="vs-con-input">
                        <input class="vs-inputx vs-input--input normal" type="number" 
                             v-model="age">
                        <code v-if="$v.age.$error" >Champ requis</code>
                    </div>
                </div>
            </div>
            <div v-if="selectedModel && selectedType.name == 'téléphone' " class="default-input d-flex align-items-center mb-4">
                <div class="col-1"></div>
                <div class="vs-component vs-con-input-label vs-input inputx col-2 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Etat de l'écran </label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.phone.state_screen.$error }"
                            :options='["comme_neuf", "bonne_état", "abimé", "cassé" ]' type="date" v-model="phone.state_screen">
                            <b-form-select-option :value="null">Choisissez</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>
                
                <div class="vs-component vs-con-input-label vs-input inputx col-2 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Etat de la coque</label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal" :class="{ 'is-invalid' : $v.phone.state_body.$error }"
                            :options='["comme_neuf", "bonne_état", "abimé", "cassé" ]' v-model="phone.state_body">
                            <b-form-select-option :value="null">Choisissez</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>
                
                <div class="vs-component vs-con-input-label vs-input inputx col-2 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Sim débloqué ? </label>
                    <div class="vs-con-input">
                        <b-form-select class="vs-inputx vs-input--input normal"
                            :class="{ 'is-invalid' : $v.phone.simBlocked.$error }" 
                            :options='[{value: 1, text: "Oui"}, {value: 0, text: "Non"} ]' v-model="phone.simBlocked">
                            <b-form-select-option :value="null">Choisissez</b-form-select-option>
                        </b-form-select>
                    </div>
                </div>
                <div class="vs-component vs-con-input-label vs-input inputx col-2 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Stockage (GO) </label>
                    <div class="vs-con-input">
                        <input :class="{ 'is-invalid' : $v.phone.storage.$error }" class="vs-inputx vs-input--input normal" type="number"
                             v-model="phone.storage">
                        </div>
                </div>
            </div>
            <div class="default-input d-flex align-items-center mb-4">
                <div class="col-2"></div>
                <vs-button @click="saveResall()" color="success" icon="save">Enregistrer</vs-button>
            </div>
        </vs-card>
    </div>
</template>

<script>
import brc from '../custom/breadc.vue'
import axios from 'axios';
import { required, email, sameAs, minLength, requiredUnless, requiredIf } from 'vuelidate/lib/validators'
import Input from '../vuesax/input/input.vue';
/* eslint-disable */
export default {
    components:{
        'brc' : brc,
        Input,
    },
    data() {
        return {
            typesCollection:[],
            selectedType: null,
            brandsCollection: [],
            selectedBrand: null,
            modelsCollection: [],
            selectedModel: null,
            color: null,
            age: null,
            phone: {
                state_screen: null,
                state_body:null,
                simBlocked:null,
                storage:null,
            }
        }
    },
    watch:{
        selectedType: function (newVal, val){
            console.log(" newVal , val :: ", val, newVal)
            if(newVal){
                this.loadBrands()
            }
        },
        selectedBrand: function (newVal, val){
            if(newVal){
                this.loadModeles()
            }
        }
    },
    mounted() {
        axios.
            get('/categories/all').then( res => {
                 console.log( 'REs : ', res.data.rows)
                this.typesCollection = res.data.rows
            })
    },
    methods: {
        loadBrands(){
            axios.
                get('/brand/all').then( res => {
                    console.log( 'REs ---- : ', res.data.rows)
                    this.brandsCollection = res.data.rows
                })
        },
        ///api/model/all
        loadModeles(){
            axios.
                get('model/all?typeId=' + this.selectedType.id + "&brandId=" + this.selectedBrand.id ).then( res => {
                    console.log( 'REs MODELS : ', res.data.rows)
                    this.modelsCollection = res.data.rows
                    console.log('modelsCollection ', this.modelsCollection)
                })
        },
        saveResall(){
            this.$v.$touch()
            console.log("this.$v",  this.$v)
            if(this.$v.$invalid){
                //this.FormValsError = true
                console.log(" INVALID :::: this.$v",  this.$v)
            }else{
                let _stt = null
                if(this.selectedType.name == 'téléphone' ){
                    _stt = this.phone
                }
                this.phone.storage = parseInt(this.phone.storage)
                axios.
                    post('resall/create', {
                            modeleId: this.selectedModel,
                            state: this.phone,
                            description: "any",
                            color: this.color,
                            age: 36
                    } ).then( res => {
                        console.log(res.data.revente.prixPropose)
                        if(res.data.revente.prixPropose){
                            swal("Revente enregistré!",
                                "Nous vous proposont " + res.data.revente.prixPropose + "€ pour cet revente, vous pouvez accepter ou refuser notre proposition sur la liste de vos reventes.",
                                "success");
                        }else{
                            swal("Revente enregistré!",
                                "Nous n'avons pas de propositions pour votre revente, un agent va valueriser votre produit, et vous aller etre notifiés par mail.",
                                "success");
                        }
                        this.$router.push('/myresalls')
                    }, err =>{
                        swal(   "Operation échoué!",
                                "Merci de rééssayer ou contacter un administrateur.",
                                "success");
                    })
            }
        }
    },
    validations: {
        selectedType: {
          required,
        },
        selectedBrand: {
          required,
        },
        selectedModel: {
          required,
        },
        color: {
          required,
        },
        age: {
          required,
        },
        phone: {
            state_screen: requiredIf(function () {
                return this.selectedType.name == 'téléphone' }),
            state_body:requiredIf(function () {
                return this.selectedType.name == 'téléphone' }),
            simBlocked:requiredIf(function () {
                return this.selectedType.name == 'téléphone' }),
            storage:requiredIf(function () {
                return this.selectedType.name == 'téléphone' })
        }
    }
}
</script>