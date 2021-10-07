<template>
    <div v-if="product">
        <div class="card">
            <div v-if="! editing" class="card-body">
                <h4 class="card-title d-flex">
                    Fiche de produit
                    <button type="button" @click="editing = true" name="button" class=" btn btn-info btn-circle vs-component vs-button ml-auto p-0 vs-button-line" 
                        style="border-radius: 100%;">
                        <i class="ti-pencil-alt"></i>
                    </button>
                </h4>
                <div class="vs-list">
                    <div v-if="product.modele" class="vs-list--item">
                        <div class="list-titles">
                            <div class="vs-list--title">Type du produit</div>
                            <div class="vs-list--subtitle" > {{ product.modele.type.name }}  </div>
                        </div>
                    </div>
                    <div v-if="product.modele" class="vs-list--item">
                        <div class="list-titles">
                            <div class="vs-list--title">Modèle</div>
                            <div class="vs-list--subtitle" > {{ product.modele.name }}  </div>
                        </div>
                    </div>
                    <div class="vs-list--item">
                        <div class="list-titles">
                            <div class="vs-list--title">Age</div>
                            <div class="vs-list--subtitle" > {{ product.age }} Mois  </div>
                        </div>
                    </div>
                    <div class="vs-list--item">
                        <div class="list-titles">
                            <div class="vs-list--title">Couleur</div>
                            <div class="vs-list--subtitle" > {{ product.couleur }}  </div>
                        </div>
                    </div>
                    <div class="vs-list--item">
                        <div class="list-titles">
                            <div class="vs-list--title">Description</div>
                            <div class="vs-list--subtitle" > {{ product.description }}  </div>
                        </div>
                    </div>
                    <div class="vs-list--item">
                        <div class="list-titles">
                            <div class="vs-list--title">Etat</div>
                            <div class="vs-list--subtitle" v-for="(det, index) in JSON.parse(product.state)" :key="index"  > 
                                {{ index | stateFilter }} : {{ det | stateFilter }}.
                            </div>  
                    </div>
                    </div>
                    <div class="vs-list--slot"></div>
                    
                </div>
            </div>
            <div v-else>
                <div class="default-input d-flex align-items-center mb-2 ml-4">
                    <div class="vs-component vs-con-input-label vs-input inputx col-10 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.prdData.name.$error }">
                        <label for="" class="vs-input--label">Titre </label>
                        <div class="vs-con-input">
                            <input class="vs-inputx vs-input--input normal" type="text" 
                                v-model="prdData.name">
                            <code v-if="$v.prdData.name.$error" >Champ requis</code>
                        </div>
                    </div>
                </div>
                <div class="default-input d-flex align-items-center mb-2 ml-4">
                    <div class="vs-component vs-con-input-label vs-input inputx col-10 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.prdData.couleur.$error }">
                        <label for="" class="vs-input--label">Couleur </label>
                        <div class="vs-con-input">
                            <input class="vs-inputx vs-input--input normal" type="text" 
                                v-model="prdData.couleur">
                            <code v-if="$v.prdData.couleur.$error" >Champ requis</code>
                        </div>
                    </div>
                </div>
                <div class="default-input d-flex align-items-center mb-2 ml-4">
                    <div class="vs-component vs-con-input-label vs-input inputx col-10 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.prdData.description.$error }">
                        <label for="" class="vs-input--label">Description </label>
                        <div class="vs-con-input">
                            <textarea class="vs-inputx vs-input--input normal" v-model="prdData.description" name="story"
                                    rows="5" >
                            </textarea>
                            <code v-if="$v.prdData.description.$error" >Champ requis</code>
                        </div>
                        
                    </div>
                </div>
                <div class="default-input d-flex align-items-center mb-2 ml-4">
                    <div class="vs-component vs-con-input-label vs-input inputx col-10 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.prdData.prix_vente.$error }">
                        <label for="" class="vs-input--label">Prix de vente </label>
                        <div class="vs-con-input">
                            <input class="vs-inputx vs-input--input normal" type="text" 
                                v-model="prdData.prix_vente">
                            <code v-if="$v.prdData.prix_vente.$error" >Champ requis</code>
                        </div>
                    </div>
                </div>
                <div class="default-input d-flex align-items-center mb-2 ml-4">
                    <div class="vs-component vs-con-input-label vs-input inputx col-10 ml-4 vs-input-primary" :class="{ 'input-icon-validate-danger' : $v.prdData.age.$error }">
                        <label for="" class="vs-input--label">Age (mois) </label>
                        <div class="vs-con-input">
                            <input class="vs-inputx vs-input--input normal" type="text" 
                                v-model="prdData.age">
                            <code v-if="$v.prdData.age.$error" >Champ requis</code>
                        </div>
                    </div>
                </div>
                <div class="default-input d-flex align-items-center mb-2 ml-4">
                    <div class="vs-component vs-con-input-label vs-input inputx col-10 ml-4 vs-input-primary">
                        <vs-button color="success" @click="savePrd" icon="save">
                            Enregistrer
                        </vs-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import axios from 'axios';
/* eslint-disable */
export default {
    props: {
        product: {
            type: Object
        }
    },
    data() {
        return {
            editing: false,
            prdData:{
                name: null,
                couleur: null,
                description: null,
                prix_vente: null,
                age: null
            }
        }
    },
    mounted() {
        this.prdData.name = this.product.name
        this.prdData.couleur = this.product.couleur
        this.prdData.description = this.product.description
        this.prdData.prix_vente = this.product.prix_vente
        this.prdData.age = this.product.age
    },
    filters: {
        stateFilter: function (value) {
            if (value == 'state_screen') return "Etat de l'écran"
            if (value == 'state_body') return "Etat de la coque"
            if (value == 'simBlocked') return "Opérteur bloqué"
            if (value == 1) return "Oui"
            if (value == 0) return "Non"
            if (value == 'storage') return "Capacité de stockage"
            return value
        }
    },
    methods: {
        savePrd(){
            this.$v.$touch()
            if(! this.$v.$invalid){
                axios.
                    put('product/' + this.product.id , {
                            name: this.prdData.name ,
                            description: this.prdData.description ,
                            couleur: this.prdData.couleur ,
                            age: this.prdData.age ,
                            prix_vente: this.prdData.prix_vente
                    } ).then( res => {
                        swal("Modification enregistrée!",
                            "",
                            "success");
                        this.editing = false
                        this.$parent.$parent.loadData()
                    },err =>{
                        swal("Erreur!",
                            "Nous n'avons pas de propositions pour votre revente, un agent va valueriser votre produit, et vous aller etre notifiés par mail.",
                            "error"
                            )
                    })
                           
            }
        }
    },
    validations: {
        prdData:{
            name: {
                required,
            },
            couleur: {
                required,
            },
            description: {
                required,
            },
            prix_vente: {
                required,
            },
            age: {
                required,
            }
        }
    }
}
</script>