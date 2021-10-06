<template>
    <div class="login-register">
        <div class="login-box card">
            <div class="p-3">
                <div class="text-center">
                    <h4>Authentification</h4>
                    <p class="text-muted">Bienvenue chez green repack</p>
                </div>

                <vs-input
                    :valid.sync="valid.email"
                    success-text="Correo Valido"
                    class="w-100 mb-2"
                    danger-text="The email does not meet the requirements"
                    type="email"
                    label-placeholder="Adresse mail ou nom d'utilisateur"
                    v-model="username"
                />

                <vs-input
                    :valid.sync="valid.password"
                    success-text="Password Valida"
                    danger-text="The password must have at least 8 characters, 1 number, 1 special character"
                    type="password"
                    class="mb-3"
                    label-placeholder="Mot de passe"
                    v-model="password"
                />

                <vs-button @click="login()" width="100%" color="primary" type="gradient" class="w-100">Authentification</vs-button>
                
                <div class="form-group m-b-0">
                    <div class="col-sm-12 text-center">
                        Vous n'etes pas membre? <a @click="switchToRegister" class="text-info m-l-5"><b>S'inscrire</b></a>
                    </div>
                </div>
                <div class="form-group m-b-0">
                    <div class="col-sm-12 text-center">
                        Mot de passe oublié? <a @click="resetingPass = true" class="text-info m-l-5"><b>Recevez un nouveau</b></a>
                    </div>
                </div>
                <vs-popup title="Recevez un nouveau mot de passe" :active.sync="resetingPass">
                    <vs-input :danger="$v.email_newPass.$error"  class="inputx mb-4 col-11" placeholder="Votre adresse mail" v-model="email_newPass"/>
                    <vs-button @click="getNewPass()" color="success" icon="save" type="filled">
                        Envoyer
                    </vs-button>
                </vs-popup>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import auth from '../../../auth'
import axios from 'axios'
import { required, email } from 'vuelidate/lib/validators'
export default {
    data() {
        return {
            auth: auth,
            title: "Dropdown",
            defaultdropdown: false,
            colordropdown: false,
            colorx: "#c80948",
            opgrpdropdown: false,
            logindropdown: false,
            username: "",
            password: "",
            resetingPass: false,
            email_newPass: null,
            valid: {
                email: false,
                password: false
            },
            dropdownbtn: false
        }
    },
    methods:{
        switchToRegister(){
            this.$parent.switchToRegister()
        },
        login(){
            console.log(' LOGIN : ', this.username, this.password)
            this.auth.login(this.username, this.password)
        },
        getNewPass(){
            this.$v.$touch()
            if(! this.$v.$invalid){
                axios.get("getnewpass?email="+ this.email_newPass )
                    .then(res=>{
                        this.resetingPass = false
                        swal("Enregistré!", 
                            "Votre demande est enregistrée, vous allez recevoir un mail contenant votre nouveau mot de pass.",
                            "success")
                    }, error=> {
                        swal("Erreur!", 
                            "une erreur est survenue veuillez réessayer ultérieurement!",
                            "error")
                    })
            }
        }
    },
    validations: {
        email_newPass:{
                required, email
            }
    }
}
</script>
