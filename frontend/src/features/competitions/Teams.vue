<script setup>
import { onMounted, reactive, ref } from 'vue';
import { api, session } from '../../api';
import Feedback from '../../Feedback.vue';

const teams = ref([]);
const form = reactive({ nombre: '', juegoPreferido: '' });
const loading = ref(true);
const error = ref('');
const success = ref('');

async function load() {
  teams.value = await api('/equipos');
}

onMounted(async () => {
  try { await load(); }
  catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
});

async function create() {
  error.value = success.value = '';
  loading.value = true;
  try {
    const team = await api('/equipos', { method: 'POST', body: form });
    // Agrega a la lista reactiva el equipo devuelto por la API.
    teams.value.push(team);
    form.nombre = form.juegoPreferido = '';
    success.value = 'Equipo creado.';
  } catch (failure) {
    error.value = failure.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h1>Equipos</h1>
  <form v-if="session?.user.rol === 'estudiante'" class="panel stack" @submit.prevent="create">
    <h2>Crear equipo</h2>
    <label>Nombre <input v-model.trim="form.nombre" required minlength="2" maxlength="100"></label>
    <label>Juego preferido <input v-model.trim="form.juegoPreferido" required minlength="2" maxlength="80"></label>
    <button :disabled="loading">Crear equipo</button>
  </form>
  <Feedback :loading="loading" :error="error" :success="success" :empty="teams.length ? '' : 'Aún no hay equipos.'" />
  <ul>
    <li v-for="team in teams" :key="team.id"><RouterLink :to="'/equipos/' + team.id">{{ team.nombre }}</RouterLink> · {{ team.juegoPreferido }} · {{ team.estado }}</li>
  </ul>
</template>
