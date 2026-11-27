import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Inicio from './Inicio.vue';
import './style.css';
import { session } from './api';

// Vite carga las rutas que declara cada módulo.
const features = import.meta.glob('./features/*/routes.js', { eager: true });
const routes = Object.values(features).flatMap(module => module.routes);
// Usa URLs normales y una vista de respaldo para rutas desconocidas.
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Inicio }, ...routes, { path: '/:pathMatch(.*)*', component: Inicio, props: { missing: true } }],
});

// Controla la navegación según la sesión y el rol.
router.beforeEach(to => {
  // Guarda el destino original para retomarlo después del login.
  if (to.meta.auth && !session.value) return { path: '/ingresar', query: { volver: to.fullPath } };
  if (to.meta.admin && session.value?.user.rol !== 'admin') return '/';
});

createApp(App).use(router).mount('#app');
