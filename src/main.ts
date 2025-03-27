import { createApp } from 'vue'
import './assets/main.css'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin'

import HomeView from './components/HelloWorld.vue'
import AboutView from './components/HelloWorld.vue'

const routes = [
  { path: '/', component: HomeView, props: { msg: "Home" } },
  { path: '/about', component: AboutView, props: { msg: "About" } },
]


const router = createRouter({
    routes: routes,
    history: createWebHistory()
})


const app = createApp(App)

app.use(router)
app.use(ui)
app.mount('#app')
