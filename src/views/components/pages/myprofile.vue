<template>
    <vs-card>
        <vs-list>
            <vs-list-header title="Vos informations"></vs-list-header>
            <div class="list-titles"><div class="vs-list--title">Nom et prénom</div>
                <div class="vs-list--subtitle">{{ auth.user.firstName  + " " + auth.user.lastName }}
                </div>
            </div>
            <div class="list-titles mt-4"><div class="vs-list--title">Adresse mail</div>
                <div class="vs-list--subtitle">{{ auth.user.email  }}
                </div>
            </div>

            <div class="list-titles mt-4 mb-4"><div class="vs-list--title">Adresse </div>
                <div class="vs-list--subtitle col-12 row">
                    <div class="col-9 ml-3">
                        {{ auth.user.adresse  }}
                    </div>
                    <vs-button @click="changingAdress=true" class="col-2" color="warning" icon="edite" type="filled">
                        Modifier
                    </vs-button>
                    
                </div>
            </div>
            <vs-button @click="changingPasswd=true" color="primary" type="filled">Changer votre mot de passe</vs-button>
            
            <vs-popup classContent="popup-example" title="Nouveau mot de passe" :active.sync="changingPasswd">
                
                <vs-input class="inputx mb-4" type="password" placeholder="Votre nouveau mot de passe" v-model="pass"/>
                
                <vs-button @click="changePassword" class="mt-4" color="primary" type="filled">
                    Changer votre adresse
                </vs-button>
            </vs-popup>

            <vs-popup classContent="popup-example" title="Nouvelle adresse" :active.sync="changingAdress">
                
                <vs-input class="inputx mb-4 col-7" type="text" placeholder="Votre nouvelle adresse" v-model="newAdress"/>
                
                <vs-button @click="changeAdress" class="mt-4" color="primary" type="filled">
                    Changer votre mot de passe
                </vs-button>
            </vs-popup>
            
        </vs-list>
    </vs-card>
    
</template>

<script>
import auth from '../../../auth'
import swal from 'sweetalert';
import axios from 'axios';
 /* eslint-disable */
export default {
    data() {
        return {
            auth: auth,
            changingPasswd: false,
            pass: null,
            changingAdress: false,
            newAdress: null
        }
    },
    methods: {
        changeAdress(){
            if( ! this.newAdress  ){
                swal({
                    title: "Refusé",
                    text: 'merci de renseigner une adresse.',
                    icon: "warning"
                })
                this.changingAdress = false
            }else{
                axios.put("/setadress",
                        {
                            adresse: this.newAdress
                        }
                    ).then( res => {
                        swal({
                            title: "Adresse modifié",
                            text: '',
                            icon: "success"
                        })
                        this.changingAdress = false
                        this.setadresse = null
                        location.reload()
                    }, err => {
                        this.changingAdress = false
                        swal({
                            title: "Une erreur est servenue",
                            text: '',
                            icon: "error"
                        })
                    } )
            }
        },
        changePassword(){
            //api/setnewpass
            if( ! this.pass || this.pass.length < 4  ){
                swal({
                    title: "Refusé",
                    text: 'saisissez un mot de passe de 4 caractéres ou plus.',
                    icon: "warning"
                })
                this.changingPasswd = false
            }else{
                axios.post("/setnewpass",
                        {
                            pwd: this.pass
                        }
                    ).then( res => {
                        swal({
                            title: "mot de passe modifié",
                            text: '',
                            icon: "success"
                        })
                        this.changingPasswd = false
                        this.pass = null
                    }, err => {
                        this.changingPasswd = false
                        swal({
                            title: "Une erreur est servenue",
                            text: '',
                            icon: "error"
                        })
                    } )
            }
        }
    },
}
</script>