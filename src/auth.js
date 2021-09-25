/* eslint-disable */

import swal from 'sweetalert';
import axios from 'axios';
export default {
    checked: false,
    user: {
        authed: false,
        login: null,
        role: '',
        id: null,
        firstName: null,
        lastName: null,
        email: null
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
                    //that.user.role = result.data.roles[0]
                    if( result.data.roles.includes('ROLE_ADMIN')){
                        that.user.role = 'ROLE_ADMIN'
                        console.log('ADMIN')
                    }else{
                        that.user.role = result.data.roles[0]
                        console.log(' not ADMIN')
                    }
                    that.user.authed = true
                    that.user.login = result.data.login
                    that.user.id = result.data.id
                    that.user.firstName = result.data.firstname
                    that.user.lastName = result.data.lastname
                    that.user.email = result.data.email
                    that.checked = true
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
            this.user.roles = result.data.roles
            this.user.username = result.data.username
            this.user.id = result.data.id
            this.user.firstName = result.data.firstname
            this.user.lastName = result.data.lastname
            this.user.email = result.data.email
            localStorage.setItem('x-access-token', result.data.accessToken)
            axios.defaults.headers.common['x-access-token'] = localStorage.getItem('x-access-token')
        }, error => {
            this.checked = true
            if (error.response.status == 404) {
                swal({
                    title: "Accès refusé",
                    text: error.response.data.detail,
                    icon: "error"
                }).then()
            } else if (error.response.status == 401) {
                swal({
                    title: "Accès refusé",
                    text: error.response.data.detail,
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
                    title: "Prblème de connexion",
                    text: "La connexion n'a pas pu être établie.",
                    icon: "error"
                }).then()
            }

        })
    }
}
