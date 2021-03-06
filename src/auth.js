/* eslint-disable */

import swal from 'sweetalert';
import axios from 'axios';
import Router from './router'
export default {
    checked: false,
    user: {
        authed: false,
        login: null,
        role: '',
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        adresse: null
    },
    logout(){
        localStorage.removeItem('x-access-token')
        axios.defaults.headers.common['x-access-token'] = null
        location.reload()
    },
    getudata() {
        let that  = this
        let tkn = localStorage.getItem('x-access-token')
        
        if(tkn != null) {
            axios.defaults.headers.common['x-access-token'] = localStorage.getItem('x-access-token')
            axios.get('/auth/me').then(
                result => {

                    console.log('RES : ', result.data.roles)
                    that.user.login = result.data.login
                    that.user.role = result.data.roles[0]
                    that.user.authed = true
                    that.user.login = result.data.login
                    that.user.id = result.data.id
                    that.user.firstName = result.data.firstname
                    that.user.lastName = result.data.lastname
                    that.user.email = result.data.email
                    that.user.adresse = result.data.adresse
                    that.checked = true
                    if(this.user.role=="ROLE_ADMIN" || this.user.role=="ROLE_MANAGER" ){
                        Router.push('/home')
                    }else{
                        Router.push('/store')
                    }
                },
                error=>{
                    that.checked =true
                    if(tkn != null) {
                        localStorage.removeItem('x-access-token')
                    }
                    
                }
            )
        }else{
            that.checked = true
        }
    },
    isAdminOrManager(){
        
        return (this.user.role=="ROLE_ADMIN" || this.user.role=="ROLE_MANAGER" )
    },
    login(e_mail, pass) {
        console.log(' e_mail, pass', e_mail, pass)
        axios.post("auth/signin",
            {
                password: pass,
                email: e_mail
            }
            ).then(result => {
            //this.user.authed = true
            console.log('datas : ', result.data)
            this.user.authed = true
            this.checked = true
            this.user.username = result.data.username
            this.user.id = result.data.id
            this.user.firstName = result.data.firstname
            this.user.lastName = result.data.lastname
            this.user.email = result.data.email
            this.user.role = result.data.roles[0]
            this.user.adresse = result.data.adresse
            localStorage.setItem('x-access-token', result.data.accessToken)
            axios.defaults.headers.common['x-access-token'] = localStorage.getItem('x-access-token')
            if(this.user.role=="ROLE_ADMIN" || this.user.role=="ROLE_MANAGER" ){
                Router.push('/home')
            }else{
                Router.push('/store')
            }
        }, error => {
            this.checked = true
            if (error.response.status == 404) {
                swal({
                    title: "Acc??s refus??",
                    text: error.response.data.message,
                    icon: "error"
                }).then()
            } else if (error.response.status == 401) {
                swal({
                    title: "Acc??s refus??",
                    text: error.response.data.message,
                    icon: "error"
                }).then()
            } else if (error.response.status == 400) {
                swal({
                    title: "Informations incomplettes",
                    text: "Le login et le mot de passe sont requis",
                    icon: "error"
                }).then()
            }else {
                swal({
                    title: "Prbl??me de connexion",
                    text: "La connexion n'a pas pu ??tre ??tablie.",
                    icon: "error"
                }).then()
            }

        })
    }
}
