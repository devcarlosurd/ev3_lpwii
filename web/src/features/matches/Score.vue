<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { api, session } from '../../api';
import Feedback from '../../Feedback.vue';

const props = defineProps({ match: { type: Object, required: true } });
const emit = defineEmits(['recorded']);
const result = ref(null);
const loaded = ref(false);
const loading = ref(true);
const error = ref('');
const success = ref('');
const form = reactive({ puntajeLocal: 0, puntajeVisitante: 0 });
const path = '/partidos/' + props.match.id + '/resultado';
const winner = computed(() => result.value?.ganadorId === props.match.local.id ? props.match.local.nombre : props.match.visitante.nombre);

onMounted(async () => {
  try { result.value = (await api(path)).resultado; loaded.value = true; }
  catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
});

async function save() {
  error.value = '';
  if (props.match.torneo.modalidad === 'eliminacion' && form.puntajeLocal === form.puntajeVisitante) {
    error.value = 'El partido de eliminación requiere un ganador.';
    return;
  }
  loading.value = true;
  try {
    result.value = await api(path, { method: 'POST', body: form });
    emit('recorded');
    success.value = 'Resultado oficial registrado.';
  } catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
}
</script>

<template>
  <h2>Resultado oficial</h2>
  <div v-if="result" class="panel">
    <p>{{ match.local.nombre }} {{ result.puntajeLocal }} – {{ result.puntajeVisitante }} {{ match.visitante.nombre }}</p>
    <p>{{ result.ganadorId === null ? 'Empate' : 'Ganador: ' + winner }}</p>
  </div>
  <form v-else-if="loaded && session?.user.rol === 'admin'" class="panel stack" @submit.prevent="save">
    <label>{{ match.local.nombre }} <input v-model.number="form.puntajeLocal" type="number" min="0" max="999" required></label>
    <label>{{ match.visitante.nombre }} <input v-model.number="form.puntajeVisitante" type="number" min="0" max="999" required></label>
    <button :disabled="loading">Registrar resultado</button>
  </form>
  <Feedback :loading="loading" :error="error" :success="success" :empty="!result && loaded && session?.user.rol !== 'admin' ? 'Aún no hay un resultado oficial.' : ''" />
</template>
