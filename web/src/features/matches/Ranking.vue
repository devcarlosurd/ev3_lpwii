<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../../api';
import Feedback from '../../Feedback.vue';

const route = useRoute();
const data = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try { data.value = await api('/torneos/' + route.params.id + '/ranking'); }
  catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
});
</script>

<template>
  <RouterLink :to="'/torneos/' + route.params.id">Volver al torneo</RouterLink>
  <h1>Tabla de posiciones</h1>
  <Feedback :loading="loading" :error="error" :empty="data && !data.posiciones.length ? 'No hay equipos aceptados.' : ''" />
  <section v-if="data && data.posiciones.length">
    <h2>{{ data.torneo.nombre }}</h2>
    <p>Victoria 3 puntos · Empate 1 punto · Derrota 0 puntos</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th scope="col">Pos.</th><th scope="col">Equipo</th><th scope="col">Puntos</th><th scope="col">Jugados</th><th scope="col">Victorias</th><th scope="col">Empates</th><th scope="col">Derrotas</th><th scope="col">Diferencia</th></tr></thead>
        <tbody>
          <tr v-for="(row, index) in data.posiciones" :key="row.equipoId">
            <td>{{ index + 1 }}</td><th scope="row">{{ row.nombre }}</th><td>{{ row.puntos }}</td><td>{{ row.jugados }}</td>
            <td>{{ row.victorias }}</td><td>{{ row.empates }}</td><td>{{ row.derrotas }}</td><td>{{ row.diferencia }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
