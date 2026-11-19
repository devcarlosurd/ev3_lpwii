<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../../api';
import Feedback from '../../Feedback.vue';

const route = useRoute();
const tournament = ref(null);
const error = ref('');
const loading = ref(true);
const date = value => new Date(value).toLocaleString('es-CL');

onMounted(async () => {
  try {
    tournament.value = await api('/torneos/' + route.params.id);
  } catch (failure) {
    error.value = failure.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <RouterLink to="/torneos">Volver a torneos</RouterLink>
  <Feedback :loading="loading" :error="error" />
  <section v-if="tournament">
    <h1>{{ tournament.nombre }}</h1>
    <p>{{ tournament.videojuego }} · {{ tournament.modalidad }} · {{ tournament.estado }}</p>
    <p>Inicio {{ date(tournament.fechaInicio) }} · Cierre {{ date(tournament.cierreInscripcion) }}</p>
    <p>Cupo de {{ tournament.cupoMaximo }} equipos</p>
  </section>
</template>
