<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api, session } from '../../api';
import Feedback from '../../Feedback.vue';

const route = useRoute();
const team = ref(null);
const loading = ref(true);
const error = ref('');
const success = ref('');
const form = reactive({ nombre: '', juegoPreferido: '', estado: '', correos: '' });
const canEdit = computed(() => session.value && (session.value.user.rol === 'admin' || session.value.user.id === team.value?.capitanId));
const replaceMembers = ref(false);

onMounted(async () => {
  try {
    team.value = await api('/equipos/' + route.params.id);
    const { nombre, juegoPreferido, estado } = team.value;
    Object.assign(form, { nombre, juegoPreferido, estado });
  } catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
});

async function update() {
  error.value = success.value = '';
  loading.value = true;
  const { correos, ...fields } = form;
  try {
    const body = replaceMembers.value ? { ...fields, correos: correos.split(',').map(value => value.trim()).filter(Boolean) } : fields;
    team.value = await api('/equipos/' + team.value.id, { method: 'PATCH', body });
    success.value = 'Equipo actualizado.';
  } catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
}
</script>

<template>
  <RouterLink to="/equipos">Volver a equipos</RouterLink>
  <section v-if="team">
    <h1>{{ team.nombre }}</h1>
    <p>{{ team.juegoPreferido }} · {{ team.estado }} · Capitán {{ team.capitan.alias }}</p>
    <h2>Integrantes</h2>
    <ul><li v-for="player in team.integrantes" :key="player.id">{{ player.alias }}</li></ul>
    <form v-if="canEdit" class="panel stack" @submit.prevent="update">
      <label>Nombre <input v-model.trim="form.nombre" required minlength="2" maxlength="100"></label>
      <label>Juego <input v-model.trim="form.juegoPreferido" required minlength="2" maxlength="80"></label>
      <label>Estado <select v-model="form.estado"><option>activo</option><option>inactivo</option></select></label>
      <label class="row"><input v-model="replaceMembers" type="checkbox" style="width:auto"> Reemplazar integrantes adicionales</label>
      <label v-if="replaceMembers">Correos separados por comas <input v-model.trim="form.correos" type="email" multiple></label>
      <button :disabled="loading">Guardar equipo</button>
    </form>
  </section>
  <Feedback :loading="loading" :error="error" :success="success" />
</template>
