<template>
    <div class="login-register">
        <div class="login-box">
            <div class="">
                <a href="javascript:void(0)" class="text-center m-b-40"></a>
                <!-- multistep form -->
                <form id="msform">
                    <!-- fieldsets -->
                    <fieldset style="overflow: auto; height:550px;">
                        <h2 class="fs-title"> rejoignez nous ! </h2>
                        <h3 class="fs-subtitle">Informations personnelles</h3>
                         
                        <div class="form-group" :class="{'has-danger': $v.consultantData.firstname.$dirty }">
                            <input type="text" class="form-control " :class="{'form-control-danger': $v.consultantData.firstname.$dirty }" 
                                v-model="consultantData.firstname" placeholder="Prénom">
                            <small v-if="!$v.consultantData.firstname.required && $v.consultantData.firstname.$dirty " class="form-control-feedback"> Ce champ est requis. </small> 
                        </div>
                        <div class="form-group" :class="{'has-danger': $v.consultantData.lastname.$dirty }">
                            <input type="text" class="form-control " :class="{'form-control-danger': $v.consultantData.lastname.$dirty }" 
                                v-model="consultantData.lastname" placeholder="Nom">
                            <small v-if="!$v.consultantData.lastname.required && $v.consultantData.lastname.$dirty " class="form-control-feedback"> Ce champ est requis. </small> 
                        </div>
                        <div class="form-group" :class="{'has-danger': $v.consultantData.username.$dirty }">
                            <input type="text" class="form-control " :class="{'form-control-danger': $v.consultantData.lastname.$dirty }" 
                                v-model="consultantData.username" placeholder="Nom d'utilisateur">
                            <small v-if="!$v.consultantData.username.required && $v.consultantData.username.$dirty " class="form-control-feedback"> Ce champ est requis. </small> 
                        </div>
                        <div class="form-group" :class="{'has-danger': $v.consultantData.email.$dirty }">
                            <input type="text" class="form-control " :class="{'form-control-danger': $v.consultantData.email.$dirty }" 
                                v-model="consultantData.email" placeholder="Adresse mail">
                            <small v-if="!$v.consultantData.email.required && $v.consultantData.email.$dirty " class="form-control-feedback"> Ce champ est requis. </small>
                        </div>
                        <div class="form-group" :class="{'has-danger': $v.consultantData.pass.$dirty }">
                            <input type="password" class="form-control " :class="{'form-control-danger': $v.consultantData.pass.$dirty }" 
                                v-model="consultantData.pass" placeholder="mot de passe">
                            <small v-if="!$v.consultantData.pass.required && $v.consultantData.pass.$dirty " class="form-control-feedback"> Ce champ est requis. </small> 
                        </div>
                        <div class="form-group" :class="{'has-danger': $v.consultantData.cpass.$dirty }">
                            <input type="password" class="form-control " :class="{'form-control-danger': $v.consultantData.cpass.$dirty }" 
                                v-model="consultantData.cpass" placeholder="Confirmez le mot de passe">
                            <small v-if="!$v.consultantData.cpass.required && $v.consultantData.cpass.$dirty" class="form-control-feedback"> Ce champ est requis. </small> 
                        </div>
                        <button @click="submitRegister()"  type="button" class="btn btn-success btn-rounded">
                            <i class="fa fa-check"></i> Valider
                        </button>
                    </fieldset>
                </form>
                <div class="clear"></div>
            </div>
        </div>
    </div>
</template>
<script>

import axios from 'axios'
import swal from 'sweetalert'
import { required } from 'vuelidate/lib/validators'
/* eslint-disable */
export default {
    data() {
        return {
            firstStap: true,
            consultantData:{
                firstname: null,
                lastname: null,
                email: null,
                pass: null,
                cpass: null,
                username: null
            }
        }
    },
    methods: {
        submitRegister(){
            this.$v.$touch()
            const timeElapsed = Date.now();
            const today = new Date(timeElapsed);
            let requestData = {
                email: this.consultantData.email,
                firstName: this.consultantData.firstname,
                lastName: this.consultantData.lastname,
                username: this.consultantData.username,
                password: this.consultantData.pass,
                lastModifiedBy: today.toISOString(),
                lastModifiedDate: today.toISOString(),
                createdDate: today.toISOString()
            }
            this.$v.$touch()
            axios.post("auth/signup", requestData, {
                'Content-Type' : 'application/json'
                } )
                .then(res=>{
                    swal("Enregistré!", 
                        "Votre inscription a bien été enregistrée, vous allez recevoir un mail de confirmation!",
                        "success").then(() => {
                            location.reload()
                        })
                }, error=> {
                    swal("Erreur!", 
                        "une erreur est survenue veuillez réessayer ultérieurement!",
                        "error")
                })
        }
    },
    validations: {
        consultantData:{
            firstname: {
                    required
                },
            username:{
                required
            },
            lastname: {
                    required
                },
            email:{
                    required
                },
            pass: {
                    required
                },
            cpass: {
                required
            }
        }
    }
}
</script>
<style>
#msform {
    margin: 20px auto;
}

.form-group {
    margin-top: 5px; 
}
.form-control .form-control-danger{
    margin-bottom: 2px;
}
#msform input, #msform textarea {
    margin-bottom: 2px;   
}
</style>
