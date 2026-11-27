<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api, session } from '../../api';
import Feedback from '../../Feedback.vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const tournament = ref(null);
const teams = ref([]);
const entries = ref([]);
const teamId = ref('');
const error = ref('');
const success = ref(route.query.guardado ? 'Torneo guardado.' : '');
const loading = ref(false);
const admin = computed(() => session.value?.user.rol === 'admin');
// Ofrece equipos activos, habilitados para este usuario y aún sin inscripción.
const availableTeams = computed(() => teams.value.filter(team => team.estado === 'activo' &&
  (admin.value || team.capitanId === session.value?.user.id) && !entries.value.some(entry => entry.equipoId === team.id)));
// Habilita el formulario mientras el torneo esté abierto y dentro de plazo.
const open = computed(() => tournament.value?.estado === 'abierto' && new Date(tournament.value.cierreInscripcion) > new Date());
const date = value => new Date(value).toLocaleString('es-CL');
const path = '/torneos/' + id;

// Centraliza el estado de carga y los mensajes de cada acción.
async function act(work, message = '') {
  loading.value = true;
  error.value = '';
  try { await work(); if (message) success.value = message; }
  catch (failure) { error.value = failure.message; success.value = ''; }
  finally { loading.value = false; }
}

async function loadEntries() {
  entries.value = await api(path + '/inscripciones');
}

onMounted(() => act(async () => {
  tournament.value = await api(path);
  await loadEntries();
  if (session.value) teams.value = await api('/equipos');
}));

// Envía el equipo seleccionado y recarga las inscripciones.
function submit() {
  return act(async () => {
    await api(path + '/inscripciones', { method: 'POST', body: { equipoId: teamId.value } });
    teamId.value = '';
    await loadEntries();
  }, 'Inscripción enviada.');
}

// Envía la decisión del administrador y refresca el listado.
function review(entry, estado) {
  return act(async () => {
    await api(path + '/inscripciones/' + entry.id, { method: 'PATCH', body: { estado } });
    await loadEntries();
  }, 'Inscripción actualizada.');
}

function remove() {
  // Pide confirmación antes de eliminar el torneo.
  if (!window.confirm('¿Eliminar este torneo y sus inscripciones?')) return;
  return act(async () => {
    await api(path, { method: 'DELETE' });
    await router.push({ path: '/torneos', query: { eliminado: '1' } });
  });
}
</script>

<template>
  <RouterLink to="/torneos">Volver a torneos</RouterLink>
  <Feedback :loading="loading" :error="error" :success="success" />
  <section v-if="tournament">
    <h1>{{ tournament.nombre }}</h1>
    <p>{{ tournament.videojuego }} · {{ tournament.modalidad }} · {{ tournament.estado }}</p>
    <p>Inicio {{ date(tournament.fechaInicio) }} · Cierre {{ date(tournament.cierreInscripcion) }}</p>
    <p>Cupo de {{ tournament.cupoMaximo }} equipos</p>
    <div class="row">
      <RouterLink v-if="$router.hasRoute('ranking')" :to="'/torneos/' + id + '/ranking'">Ver ranking</RouterLink>
      <RouterLink v-if="admin" :to="path + '/editar'">Editar torneo</RouterLink>
      <button v-if="admin" class="subtle" :disabled="loading" @click="remove">Eliminar torneo</button>
    </div>
    <h2>Inscripciones</h2>
    <p v-if="!entries.length && !loading">Aún no hay inscripciones.</p>
    <ul>
      <li v-for="entry in entries" :key="entry.id" class="row">
        <RouterLink :to="'/equipos/' + entry.equipoId">{{ entry.equipo }}</RouterLink> · {{ entry.estado }}
        <button v-if="admin && entry.estado !== 'aceptada'" :disabled="loading" @click="review(entry, 'aceptada')">Aceptar</button>
        <button v-if="admin && entry.estado !== 'rechazada'" class="subtle" :disabled="loading" @click="review(entry, 'rechazada')">Rechazar</button>
      </li>
    </ul>
    <form v-if="session && open && availableTeams.length" class="panel stack" @submit.prevent="submit">
      <label>Equipo
        <select v-model="teamId" required>
          <option disabled value="">Seleccionar equipo</option>
          <option v-for="team in availableTeams" :key="team.id" :value="team.id">{{ team.nombre }}</option>
        </select>
      </label>
      <button :disabled="loading">Inscribir equipo</button>
    </form>
    <p v-else-if="session && open">No tienes equipos disponibles para inscribir.</p>
  </section>
</template>
