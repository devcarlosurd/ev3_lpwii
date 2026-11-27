<script setup>
import { useRouter } from 'vue-router';
import { session, setSession } from './api';

const router = useRouter();
const modules = import.meta.glob('./features/*/routes.js', { eager: true });
// El menú se arma con las rutas que declaran una etiqueta.
const routes = Object.values(modules).flatMap(module => module.routes);
// Limpia la sesión y vuelve a la página de inicio.
function logout() {
  setSession(null);
  router.push('/');
}
</script>

<template>
  <header class="nav">
    <RouterLink class="brand" to="/">GameHub <span>IPVG</span></RouterLink>
    <nav aria-label="Navegación principal">
      <RouterLink v-for="route in routes.filter(route => route.meta?.label && (!route.meta.auth || session) && (!route.meta.admin || session?.user.rol === 'admin'))"
        :key="route.path" :to="route.path">{{ route.meta.label }}</RouterLink>
      <RouterLink v-if="!session && routes.some(route => route.path === '/ingresar')" to="/ingresar">Ingresar</RouterLink>
      <button v-if="session" type="button" class="subtle" @click="logout">Cerrar sesión</button>
    </nav>
  </header>
  <!-- La clave hace que la vista se vuelva a montar al cambiar la ruta. -->
  <main><RouterView :key="$route.path" /></main>
</template>
