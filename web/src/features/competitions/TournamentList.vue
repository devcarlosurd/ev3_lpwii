<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api, session } from '../../api';
import Feedback from '../../Feedback.vue';
import TournamentCard from './TournamentCard.vue';

const router = useRouter();
const tournaments = ref([]);
const search = ref('');
const state = ref('');
const mode = ref('');
const showFilters = ref(true);
const loading = ref(true);
const error = ref('');
const filtered = computed(() => tournaments.value.filter(tournament => {
  const text = (tournament.nombre + ' ' + tournament.videojuego).toLocaleLowerCase('es');
  return text.includes(search.value.toLocaleLowerCase('es')) &&
    (!state.value || tournament.estado === state.value) &&
    (!mode.value || tournament.modalidad === mode.value);
}));

onMounted(async () => {
  try {
    tournaments.value = await api('/torneos');
  } catch (failure) {
    error.value = failure.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <h1>Torneos</h1>
  <div class="row">
    <button class="subtle" type="button" :aria-expanded="showFilters" @click="showFilters = !showFilters">{{ showFilters ? 'Ocultar filtros' : 'Mostrar filtros' }}</button>
    <RouterLink v-if="session?.user.rol === 'admin' && $router.hasRoute('torneo-nuevo')" to="/torneos/nuevo">Crear torneo</RouterLink>
  </div>
  <div v-show="showFilters" class="panel row">
    <label>Buscar <input v-model.trim="search" type="search" placeholder="Nombre o videojuego"></label>
    <label>Estado
      <select v-model="state"><option value="">Todos</option><option>abierto</option><option>cerrado</option><option>finalizado</option></select>
    </label>
    <label>Modalidad
      <select v-model="mode"><option value="">Todas</option><option>liga</option><option value="eliminacion">eliminación</option></select>
    </label>
  </div>
  <Feedback :loading="loading" :error="error" :success="$route.query.eliminado ? 'Torneo eliminado.' : ''" />
  <Feedback v-if="!loading && !error && !filtered.length" empty="No hay torneos para esta búsqueda." />
  <div v-if="!loading && !error" class="grid">
    <TournamentCard v-for="tournament in filtered" :key="tournament.id" :tournament="tournament" @detail="id => router.push('/torneos/' + id)" />
  </div>
</template>
