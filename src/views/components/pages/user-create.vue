<template>
    <div class="container-fluid">
        <div>
            <brc :name="'Utilisateur'" 
                :ope="'Créer & éditer'"
                :showbtn="false" >
            </brc>
        </div>
        <vs-card>

            <div class="default-input d-flex align-items-center mb-4">
                <div class="col-1"></div>
                <vs-input label="Prénom" :danger="$v.firstname.$error" class="inputx col-4 ml-4"  v-model="firstname" />
                <vs-input label="Nom" :danger="$v.lastname.$error" class="inputx ml-3 col-4"  v-model="lastname" />
            </div>
            <div class="default-input d-flex align-items-center mb-4">
                <div class="col-1"></div>
                <vs-input label="Adresse mail" :danger="$v.email.$error" class="inputx col-4 ml-4" v-model="email" />
                <div class="vs-component vs-con-input-label vs-input inputx col-4 ml-4 vs-input-primary">
                    <label for="" class="vs-input--label">Role</label>
                        <div class="vs-con-input">
                            <b-form-select :disabled="modif" class="vs-inputx vs-input--input normal"
                                :class="{ 'is-invalid' : $v.role.$error }"
                                :options="roles"  type="date" v-model="role"> 
                            </b-form-select>
                        </div>
                </div>
            </div>
            <div class="default-input d-flex align-items-center mb-4">
                <div class="col-1"></div>
                <vs-input label="Téléphone" :danger="$v.telephone.$error" class="inputx col-3 ml-3" v-model="telephone" />
                <vs-input label="Nom d'utilisateur" :danger="$v.username.$error" class="inputx ml-3 col-3" v-model="username" />
                <vs-input
                    type="password"
                    label="mot de passe"
                    class="inputx ml-3 col-3"
                    v-model="password"
                    :danger="$v.password.$error"
                />
            </div>
            <div class="default-input d-flex align-items-center mb-4">
                <div class="col-1"></div>
                <vs-button @click="saveUser()" color="success" icon="save">Enregistrer</vs-button>
            </div>
        </vs-card>
    </div>
</template>
<script>
import brc from '../custom/breadc.vue'
import axios from 'axios';
import { required, email, sameAs, minLength, requiredUnless, requiredIf } from 'vuelidate/lib/validators'
/* eslint-disable */
export default {
    components:{
        'brc' : brc,
    },
    data(){
        return{
            firstname: '',
            lastname: '',
            email: '',
            telephone: null,
            roles:[{text: 'administratuer', value: 'admin' }, { text :'Manager', value: 'manager' }],
            role: null,
            password: null,
            modif: false,
            username: null
        }
    },
    mounted(){
        if(this.$route.params.id){
            console.log(this.$route.params.id)
            this.modif = true
            axios.get('/user/' + this.$route.params.id)
            .then( result=> {
                console.log( result.data.users)
                this.email = result.data.users.email
                this.lastname = result.data.users.lastname
                this.firstname = result.data.users.firstname
                this.username = result.data.users.username
                this.telephone = result.data.users.telephone
                this.role = result.data.users.roles[0].name
            }, error => {
                swal("Erreur de chargement!",
                        "La page va être rechargé, réessayerz ou contactez votre administrateur",
                        "error")
                        .then((value) => {
                            location.reload()
                        });
                    
                }
            )
        }
    },
    computed: {
        isEditing() {
            return this.modif // some conditional logic here...
        }
    },
    methods:{
        saveUser(){
            this.$v.$touch()
            console.log(this.$v)
            if(this.$v.$invalid){
                //this.FormValsError = true
            }else{
                if(this.modif){
                axios.put('user/' + this.$route.params.id , {
                    email: this.email,
                    lastname: this.lastname,
                    firstname: this.firstname,
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    telephone: this.telephone,
                    adresse: 'ANY'
                }).then(result =>
                    {
                        swal("Operation réussie!",
                            "",
                            "success");
                        console.log(result)
                        this.$router.push('/users')
                    }, error=>{
                        console.log('save error' ,error)
                        swal("Erreur!",
                            "",
                            "error");
                    }
                )
                }else{
                    
                    axios.post('user', {
                        email: this.email,
                        role: this.role,
                        password: this.password,
                        email: this.email,
                        lastname: this.lastname,
                        firstname: this.firstname,
                        username: this.username,
                        email: this.email,
                        telephone: this.telephone,
                        adresse: 'ANY'
                    }).then(result =>
                        {
                            swal("Operation réussie!",
                                "",
                                "success");
                            console.log(result)
                            this.$router.push('/users')
                        }, error=>{
                            swal("Erreur!",
                                "",
                                "error");
                            })
                    }
                }
            
        }
    },
    validations: {
        firstname: {
          required,
        },
        lastname: {
          required,
        },
        email: {
          required,
          email
        },
        role: {
          required:  requiredIf(function () {
                return !this.isEditing }),
        },
        password: {
          required : requiredIf(function () {
                return !this.isEditing }),
          minLength: minLength(4)
        },
        telephone: {
          required
        },
        username: {
          required
        },
        
    }

}
</script>>