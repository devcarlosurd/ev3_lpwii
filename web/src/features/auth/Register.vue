<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../../api';
import Feedback from '../../Feedback.vue';

const form = reactive({ nombre: '', alias: '', correo: '', password: '' });
const loading = ref(false);
const error = ref('');
const router = useRouter();

async function register() {
  error.value = '';
  loading.value = true;
  try {
    await api('/auth/registro', { method: 'POST', body: form });
    await router.push({ path: '/ingresar', query: { registro: '1' } });
  } catch (failure) {
    error.value = failure.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h1>Crear cuenta</h1>
  <form class="panel stack" @submit.prevent="register">
    <label>Nombre <input v-model.trim="form.nombre" required minlength="2" maxlength="100" autocomplete="name"></label>
    <label>Alias <input v-model.trim="form.alias" required minlength="2" maxlength="40" autocomplete="nickname"></label>
    <label>Correo <input v-model.trim="form.correo" type="email" required maxlength="180" autocomplete="email"></label>
    <label>Contraseña <input v-model="form.password" type="password" required minlength="8" maxlength="128" autocomplete="new-password"></label>
    <button :disabled="loading">Crear cuenta</button>
    <Feedback :loading="loading" :error="error" />
  </form>
</template>
