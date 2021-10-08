import Vue from 'vue'
import Router from 'vue-router'
import auth from './auth'
/* eslint-disable */ 
Vue.use(Router)

export default new Router({
	routes: [
    {
			path: '',
            component: () => import('./layout/full/MainContainer.vue'),
            // ======================
            // Theme routes / pages
            // ======================

            children: [
                {
                    path: '/',
                    redirect: '/home'
                },
                {
                    path: '/home',
                    name: 'Starterkit',
                    index: 41,
                    beforeEnter:(to, from, next) => {
                        console.log( ' :::: auth.isAdminOrManager :::: ', auth.isAdminOrManager())
                        if(auth.isAdminOrManager()){
                            next()
                        }else{
                            next('/store')
                        }
                    },
                    component: () => import('./views/StarterPage.vue')
                },{
                    path: '/warehouse',
                    name: 'warehouse',
                    index: 41,
                    beforeEnter:(to, from, next) => {
                        console.log( ' :::: auth.isAdminOrManager :::: ', auth.isAdminOrManager())
                        if(auth.isAdminOrManager()){
                            next()
                        }else{
                            next('/store')
                        }
                    },
                    component: () => import('./views/components/pages/warehouse.vue')
                },{
                    path: '/users',
                    name: 'users',
                    index: 41,
                    beforeEnter:(to, from, next) => {
                        console.log( ' :::: auth.isAdminOrManager :::: ', auth.isAdminOrManager())
                        if(auth.isAdminOrManager()){
                            next()
                        }else{
                            next('/store')
                        }
                    } ,
                    component: () => import('./views/components/pages/users-manage.vue')
                },
                //store
                {
                    path: '/store',
                    name: 'store',
                    index: 40,
                    component: () => import('./views/components/pages/store.vue')
                },
                //myprofile
                {
                    path: '/myprofile',
                    name: 'myprofile',
                    index: 40,
                    component: () => import('./views/components/pages/myprofile.vue')
                },
                {
                    path: '/myorders',
                    name: 'myorders',
                    index: 40,
                    component: () => import('./views/components/pages/myorders.vue')
                },
                {
                    path: '/manageorders',
                    name: 'manageorders',
                    index: 40,
                    component: () => import('./views/components/pages/manage-orders.vue')
                },
                {
                    path: '/mycard',
                    name: 'mycard',
                    index: 39,
                    component: () => import('./views/components/pages/mycard.vue')
                },
                {
                    path: '/user/create',
                    name: 'usercreate',
                    index: 38,
                    beforeEnter:(to, from, next) => {
                        console.log( ' :::: auth.isAdminOrManager :::: ', auth.isAdminOrManager())
                        if(auth.isAdminOrManager()){
                            next()
                        }else{
                            next('/store')
                        }
                    } ,
                    component: () => import('./views/components/pages/user-create.vue')
                },{
                    path: '/user/edit/:id',
                    name: 'useredite',
                    index: 37,
                    beforeEnter:(to, from, next) => {
                        console.log( ' :::: auth.isAdminOrManager :::: ', auth.isAdminOrManager())
                        if(auth.isAdminOrManager()){
                            next()
                        }else{
                            next('/store')
                        }
                    } ,
                    component: () => import('./views/components/pages/user-create.vue')
                },{
                    path: '/products',
                    name: 'products',
                    index: 36,
                    beforeEnter:(to, from, next) => {
                        console.log( ' :::: auth.isAdminOrManager :::: ', auth.isAdminOrManager())
                        if(auth.isAdminOrManager()){
                            next()
                        }else{
                            next('/store')
                        }
                    } ,
                    component: () => import('./views/components/pages/products-manage.vue')
                },{
                    path: '/resalls',
                    name: 'resalls',
                    index: 35,
                    beforeEnter:(to, from, next) => {
                        console.log( ' :::: auth.isAdminOrManager :::: ', auth.isAdminOrManager())
                        if(auth.isAdminOrManager()){
                            next()
                        }else{
                            next('/store')
                        }
                    } ,
                    component: () => import('./views/components/pages/resalls-manage.vue')
                },{
                    path: '/projects',
                    name: 'projects',
                    index: 35,
                    beforeEnter:(to, from, next) => {
                        console.log( ' :::: auth.isAdminOrManager :::: ', auth.isAdminOrManager())
                        if(auth.isAdminOrManager()){
                            next()
                        }else{
                            next('/store')
                        }
                    } ,
                    component: () => import('./views/components/pages/projects.vue')
                },{
                    path: '/catalogue',
                    name: 'catalogue',
                    index: 34,
                    component: () => import('./views/components/pages/catalogue.vue')
                },{
                    path: '/token/verify/:tkn',
                    name: 'tokenverify',
                    index: 33,
                    component: () => import('./views/components/Login/token-validation.vue')
                }//Resalls
                ,{
                    path: '/myresalls',
                    name: 'myresalls',
                    index: 32,
                    component: () => import('./views/components/pages/user-resalle-manage.vue')
                }
                ,{
                    path: '/resall/new',
                    name: 'newresall',
                    index: 31,
                    component: () => import('./views/components/pages/new-resall.vue')
                }
                ,{
                    path: '/notification',
                    name: 'Notification',
                    index: 17,
                    component: () => import('./views/components/vuesax/notification/notification.vue')
                }

            ]
		},
    // Redirect to starterkit page, if no match found
        {
            path: '*',
            redirect: '/home'
        }
	]
})