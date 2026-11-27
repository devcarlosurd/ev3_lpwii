<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api, setSession } from '../../api';
import Feedback from '../../Feedback.vue';

// reactive enlaza los campos del formulario mediante v-model.
const form = reactive({ correo: '', password: '' });
const loading = ref(false);
const error = ref('');
const route = useRoute();
const router = useRouter();

async function login() {
  error.value = '';
  loading.value = true;
  try {
    // Guarda el JWT y los datos de la cuenta devueltos por la API.
    setSession(await api('/auth/login', { method: 'POST', body: form }));
    // Tras ingresar, vuelve al destino solicitado si es una ruta interna.
    const next = route.query.volver;
    await router.push(typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/');
  } catch (failure) {
    error.value = failure.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h1>Ingresar</h1>
  <form class="panel stack" @submit.prevent="login">
    <label>Correo <input v-model.trim="form.correo" type="email" required autocomplete="username"></label>
    <label>Contraseña <input v-model="form.password" type="password" required minlength="8" autocomplete="current-password"></label>
    <button :disabled="loading">Ingresar</button>
    <Feedback :loading="loading" :error="error" :success="$route.query.registro ? 'Tu cuenta está lista para ingresar.' : ''" />
  </form>
  <RouterLink v-if="$router.hasRoute('registro')" to="/registro">Crear cuenta de estudiante</RouterLink>
</template>
