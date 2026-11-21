<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../../api';
import Feedback from '../../Feedback.vue';

const router = useRouter();
const tournaments = ref([]);
const teams = ref([]);
const loading = ref(true);
const error = ref('');
const form = reactive({ torneoId: '', equipoLocalId: '', equipoVisitanteId: '', fechaHora: '', ronda: '' });

onMounted(async () => {
  try { tournaments.value = (await api('/torneos')).filter(tournament => tournament.estado !== 'finalizado'); }
  catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
});

watch(() => form.torneoId, async (id, _old, onCleanup) => {
  let current = true;
  onCleanup(() => { current = false; });
  form.equipoLocalId = form.equipoVisitanteId = '';
  teams.value = [];
  if (!id) return;
  loading.value = true;
  error.value = '';
  try {
    const entries = await api('/torneos/' + id + '/inscripciones');
    if (current) teams.value = entries.filter(entry => entry.estado === 'aceptada');
  } catch (failure) { if (current) error.value = failure.message; }
  finally { if (current) loading.value = false; }
});

async function create() {
  if (form.equipoLocalId === form.equipoVisitanteId) {
    error.value = 'Selecciona dos equipos distintos.';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    await api('/partidos', { method: 'POST', body: { ...form, fechaHora: new Date(form.fechaHora).toISOString() } });
    await router.push({ path: '/partidos', query: { programado: '1' } });
  } catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
}
</script>

<template>
  <RouterLink to="/partidos">Volver al calendario</RouterLink>
  <h1>Programar partido</h1>
  <form class="panel stack" @submit.prevent="create">
    <label>Torneo
      <select v-model="form.torneoId" required><option disabled value="">Seleccionar</option><option v-for="tournament in tournaments" :key="tournament.id" :value="tournament.id">{{ tournament.nombre }}</option></select>
    </label>
    <label>Equipo local
      <select v-model="form.equipoLocalId" required><option disabled value="">Seleccionar</option><option v-for="team in teams" :key="team.equipoId" :value="team.equipoId">{{ team.equipo }}</option></select>
    </label>
    <label>Equipo visitante
      <select v-model="form.equipoVisitanteId" required><option disabled value="">Seleccionar</option><option v-for="team in teams" :key="team.equipoId" :value="team.equipoId">{{ team.equipo }}</option></select>
    </label>
    <label>Fecha local <input v-model="form.fechaHora" type="datetime-local" required></label>
    <label>Ronda <input v-model.trim="form.ronda" minlength="2" maxlength="60" required></label>
    <button :disabled="loading || teams.length < 2">Programar</button>
  </form>
  <Feedback :loading="loading" :error="error" :empty="form.torneoId && teams.length < 2 ? 'Este torneo necesita al menos dos inscripciones aceptadas.' : ''" />
</template>
