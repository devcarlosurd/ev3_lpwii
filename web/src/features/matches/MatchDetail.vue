<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../../api';
import Feedback from '../../Feedback.vue';
import Score from './Score.vue';

const route = useRoute();
const match = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try { match.value = await api('/partidos/' + route.params.id); }
  catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
});
</script>

<template>
  <RouterLink to="/partidos">Volver al calendario</RouterLink>
  <Feedback :loading="loading" :error="error" />
  <section v-if="match">
    <h1>{{ match.local.nombre }} vs. {{ match.visitante.nombre }}</h1>
    <p>{{ match.torneo.nombre }} · {{ match.ronda }} · {{ match.estado }}</p>
    <p>{{ new Date(match.fechaHora).toLocaleString('es-CL') }}</p>
    <Score :match="match" @recorded="match.estado = 'finalizado'" />
  </section>
</template>
