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
                         
                        <div class="form-group" :class="{'has-danger': $v.firstname.$error }">
                            <input type="text" class="form-control " :class="{'is-invalid': $v.firstname.$error }" 
                                v-model="firstname" placeholder="Prénom">
                            <small v-if="$v.firstname.$error " class="form-control-feedback"> Ce champ est requis. </small> 
                        </div>
                        <div class="form-group" :class="{'has-danger': $v.lastname.$error }">
                            <input type="text" class="form-control " :class="{'is-invalid': $v.lastname.$error }" 
                                v-model="lastname" placeholder="Nom">
                            <small v-if="$v.lastname.$error " class="form-control-feedback"> Ce champ est requis. </small> 
                        </div>
                        <div class="form-group" :class="{'has-danger': $v.username.$error }">
                            <input type="text" class="form-control " :class="{'is-invalid': $v.username.$error }" 
                                v-model="username" placeholder="Nom d'utilisateur">
                            <small v-if="$v.username.$error " class="form-control-feedback"> Ce champ est requis. </small> 
                        </div>
                        <div class="form-group" :class="{'is-invalid': $v.email.$error }">
                            <input type="text" class="form-control " :class="{'is-invalid': $v.email.$error }" 
                                v-model="email" placeholder="Adresse mail">
                            <small v-if="$v.email.$error " class="form-control-feedback"> Ce champ est requis. </small> 
                        </div>
                        <div class="form-group" :class="{'has-danger': $v.telephone.$error }">
                            <input type="text" class="form-control " :class="{'is-invalid': $v.telephone.$error }" 
                                v-model="telephone" placeholder="Téléphone">
                            <small v-if="$v.telephone.$error" class="form-control-feedback"> Ce champ est requis. </small>
                        </div>
                        <div class="form-group" :class="{'has-danger': $v.pass.$error }">
                            <input type="password" class="form-control " :class="{'is-invalid': $v.pass.$error }" 
                                v-model="pass" placeholder="mot de passe">
                            <small v-if="$v.pass.$error" class="form-control-feedback"> Ce champ est requis. </small> 
                        </div>
                        <div class="form-group" :class="{'has-danger': $v.cpass.$error }">
                            <input type="password" class="form-control " :class="{'is-invalid': $v.cpass.$error }" 
                                v-model="cpass" placeholder="Confirmez le mot de passe">
                            <small v-if="$v.cpass.$error" class="form-control-feedback"> Ce champ est requis. </small> 
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
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
/* eslint-disable */
export default {
    data() {
        return {
            firstname: null,
            lastname: null,
            email: null,
            pass: null,
            cpass: null,
            username: null,
            telephone: null
        }
    },
    methods: {
        submitRegister(){
            this.$v.$touch()
            const timeElapsed = Date.now();
            const today = new Date(timeElapsed);
            let requestData = {
                email: this.email,
                firstname: this.firstname,
                lastname: this.lastname,
                username: this.username,
                password: this.pass,
                telephone: this.telephone
            }
            this.$v.$touch()
            if(!this.$v.$invalid){
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
        }
    },
    validations: {
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
                required, email
            },
        pass: {
                required,
                minLength: minLength(4)
            },
        cpass: {
            sameAsPassword: sameAs('pass')
        },
        telephone:{
            required
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
.form-control .is-invalid{
    margin-bottom: 2px;
}
#msform input, #msform textarea {
    margin-bottom: 2px;   
}
</style>
