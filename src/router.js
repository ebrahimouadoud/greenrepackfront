import Vue from 'vue'
import Router from 'vue-router'

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
                    redirect: '/starterkit'
                },
                {
                    path: '/starterkit',
                    name: 'Starterkit',
                    index: 1,
                    component: () => import('./views/StarterPage.vue')
                },{
                    path: '/users',
                    name: 'users',
                    index: 2,
                    component: () => import('./views/components/pages/users-manage.vue')
                },{
                    path: '/user/create',
                    name: 'usercreate',
                    index: 2,
                    component: () => import('./views/components/pages/user-create.vue')
                },{
                    path: '/user/edit/:id',
                    name: 'useredite',
                    index: 2,
                    component: () => import('./views/components/pages/user-create.vue')
                },{
                    path: '/products',
                    name: 'products',
                    index: 2,
                    component: () => import('./views/components/pages/products-manage.vue')
                },{
                    path: '/resalls',
                    name: 'resalls',
                    index: 2,
                    component: () => import('./views/components/pages/resalls-manage.vue')
                },{
                    path: '/catalogue',
                    name: 'catalogue',
                    index: 2,
                    component: () => import('./views/components/pages/catalogue.vue')
                },{
                    path: '/token/verify/:tkn',
                    name: 'tokenverify',
                    index: 2,
                    component: () => import('./views/components/Login/token-validation.vue')
                }//Resalls
                ,{
                    path: '/myresalls',
                    name: 'myresalls',
                    index: 2,
                    component: () => import('./views/components/pages/user-resalle-manage.vue')
                }
                ,{
                    path: '/resall/new',
                    name: 'newresall',
                    index: 2,
                    component: () => import('./views/components/pages/new-resall.vue')
                }
                ,{
                    path: '/avatar',
                    name: 'Avatar',
                    index: 3,
                    component: () => import('./views/components/vuesax/avatar/avatar.vue')
                },{
                    path: '/alert',
                    name: 'Alert',
                    index: 3,
                    component: () => import('./views/components/vuesax/alert/alert.vue')
                },{
                    path: '/breadcrumb',
                    name: 'Breadcrumb',
                    index: 4,
                    component: () => import('./views/components/vuesax/breadcrumb/breadcrumb.vue')
                },{
                    path: '/buttons',
                    name: 'Buttons',
                    index: 5,
                    component: () => import('./views/components/vuesax/buttons/buttons.vue')
                },{
                    path: '/cards',
                    name: 'Cards',
                    index: 6,
                    component: () => import('./views/components/vuesax/cards/cards.vue')
                },{
                    path: '/checkbox',
                    name: 'Checkbox',
                    index: 7,
                    component: () => import('./views/components/vuesax/checkbox/checkbox.vue')
                },{
                    path: '/collapse',
                    name: 'Collapse',
                    index: 9,
                    component: () => import('./views/components/vuesax/collapse/collapse.vue')
                },{
                    path: '/dialog',
                    name: 'Dialog',
                    index: 10,
                    component: () => import('./views/components/vuesax/dialog/dialog.vue')
                },{
                    path: '/divider',
                    name: 'Divider',
                    index: 11,
                    component: () => import('./views/components/vuesax/divider/divider.vue')
                },{
                    path: '/dropdown',
                    name: 'Dropdown',
                    index: 12,
                    component: () => import('./views/components/vuesax/dropdown/dropdown.vue')
                },{
                    path: '/input',
                    name: 'Input',
                    index: 13,
                    component: () => import('./views/components/vuesax/input/input.vue')
                },{
                    path: '/list',
                    name: 'List',
                    index: 14,
                    component: () => import('./views/components/vuesax/list/list.vue')
                },{
                    path: '/loading',
                    name: 'Loading',
                    index: 15,
                    component: () => import('./views/components/vuesax/loading/loading.vue')
                },{
                    path: '/navbar',
                    name: 'Navbar',
                    index: 16,
                    component: () => import('./views/components/vuesax/navbar/navbar.vue')
                },{
                    path: '/notification',
                    name: 'Notification',
                    index: 17,
                    component: () => import('./views/components/vuesax/notification/notification.vue')
                },{
                    path: '/number-input',
                    name: 'Number input',
                    index: 18,
                    component: () => import('./views/components/vuesax/number-input/number-input.vue')
                },{
                    path: '/pagination',
                    name: 'Pagination',
                    index: 19,
                    component: () => import('./views/components/vuesax/pagination/pagination.vue')
                },{
                    path: '/popup',
                    name: 'Popup',
                    index: 20,
                    component: () => import('./views/components/vuesax/popup/popup.vue')
                },{
                    path: '/progress',
                    name: 'Progress',
                    index: 21,
                    component: () => import('./views/components/vuesax/progress/progress.vue')
                },{
                    path: '/radio',
                    name: 'Radio',
                    index: 22,
                    component: () => import('./views/components/vuesax/radio/radio.vue')
                },{
                    path: '/switch',
                    name: 'Switch',
                    index: 26,
                    component: () => import('./views/components/vuesax/switch/switch.vue')
                },{
                    path: '/tabs',
                    name: 'Tabs',
                    index: 28,
                    component: () => import('./views/components/vuesax/tabs/tabs.vue')
                },{
                    path: '/textarea',
                    name: 'Textarea',
                    index: 29,
                    component: () => import('./views/components/vuesax/textarea/textarea.vue')
                }

            ]
		},
    // Redirect to starterkit page, if no match found
        {
            path: '*',
            redirect: '/starterkit'
        }
	]
})