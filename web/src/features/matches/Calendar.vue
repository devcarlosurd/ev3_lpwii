<script setup>
import { onMounted, ref } from 'vue';
import { api, session } from '../../api';
import Feedback from '../../Feedback.vue';

const matches = ref([]);
const loading = ref(true);
const error = ref('');
onMounted(async () => {
  try { matches.value = await api('/partidos'); }
  catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
});
</script>

<template>
  <h1>Calendario de partidos</h1>
  <RouterLink v-if="session?.user.rol === 'admin'" to="/partidos/nuevo">Programar partido</RouterLink>
  <Feedback :loading="loading" :error="error" :empty="matches.length ? '' : 'No hay partidos programados.'" :success="$route.query.programado ? 'Partido programado.' : ''" />
  <div class="grid">
    <article v-for="match in matches" :key="match.id" class="item">
      <p class="muted">{{ match.torneo.nombre }} · {{ match.ronda }}</p>
      <h2><RouterLink :to="'/partidos/' + match.id">{{ match.local.nombre }} vs. {{ match.visitante.nombre }}</RouterLink></h2>
      <p>{{ new Date(match.fechaHora).toLocaleString('es-CL') }} · {{ match.estado }}</p>
    </article>
  </div>
</template>
