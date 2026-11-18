import Login from './Login.vue';
import Profile from './Profile.vue';
import Register from './Register.vue';

export const routes = [
  { path: '/ingresar', component: Login },
  { path: '/registro', name: 'registro', component: Register },
  { path: '/perfil', component: Profile, meta: { auth: true, label: 'Perfil' } },
];
