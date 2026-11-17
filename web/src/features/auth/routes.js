import Login from './Login.vue';
import Register from './Register.vue';

export const routes = [
  { path: '/ingresar', component: Login },
  { path: '/registro', name: 'registro', component: Register },
];
