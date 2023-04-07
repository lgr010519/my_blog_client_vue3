import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: {
            name: 'home'
        }
    },
    {
        path: '/home',
        name: 'home',
        component: () => {
            return import('./views/Home/index.vue');
        }
    },
    {
        path: '/archives',
        name: 'archives',
        component: () => import('./views/Archives/index.vue')
    },
    {
        path: '/categories',
        name: 'categories',
        component: () => import('./views/Categories/index.vue')
    },
    {
        path: '/categories/details',
        name: 'categoriesDetails',
        component: () => import('./views/Categories/Details.vue')
    },
    {
        path: '/tags',
        name: 'tags',
        component: () => import('./views/Tags/index.vue')
    },
    {
        path: '/tags/details',
        name: 'tagsDetails',
        component: () => import('./views/Tags/Details.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('./views/About/index.vue')
    },
    {
        path: "/articles",
        name: "articles",
        component: () => import("./views/Articles/index.vue"),
    },
    {
        path: "/articles/details",
        name: "articlesDetails",
        component: () => import("./views/Articles/Details.vue"),
    },
    {
        path: "/user",
        name: "user",
        component: () => import("./views/User/index.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
