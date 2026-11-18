<script setup>
import { onMounted, reactive, ref } from 'vue';
import { api, session, setSession } from '../../api';
import Feedback from '../../Feedback.vue';

const form = reactive({ nombre: '', alias: '' });
const profile = ref(null);
const loading = ref(true);
const error = ref('');
const success = ref('');

onMounted(async () => {
  try {
    profile.value = await api('/auth/perfil');
    Object.assign(form, { nombre: profile.value.nombre, alias: profile.value.alias });
  } catch (failure) {
    error.value = failure.message;
  } finally {
    loading.value = false;
  }
});

async function update() {
  loading.value = true;
  error.value = success.value = '';
  try {
    profile.value = await api('/auth/perfil', { method: 'PATCH', body: form });
    setSession({ ...session.value, user: profile.value });
    success.value = 'Perfil actualizado.';
  } catch (failure) {
    error.value = failure.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h1>Mi perfil</h1>
  <form v-if="profile" class="panel stack" @submit.prevent="update">
    <p>{{ profile.correo }} · {{ profile.rol }}</p>
    <label>Nombre <input v-model.trim="form.nombre" required minlength="2" maxlength="100"></label>
    <label>Alias <input v-model.trim="form.alias" required minlength="2" maxlength="40"></label>
    <button :disabled="loading">Guardar perfil</button>
  </form>
  <Feedback :loading="loading" :error="error" :success="success" />
</template>
