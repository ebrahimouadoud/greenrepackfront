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
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import auth from '../../../auth'

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
        }
    }
}
</script>
