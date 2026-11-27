<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../../api';
import Feedback from '../../Feedback.vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const loading = ref(Boolean(id));
const loaded = ref(!id);
const error = ref('');
const form = reactive({ nombre: '', videojuego: '', modalidad: 'liga', fechaInicio: '', cierreInscripcion: '', cupoMaximo: 8, estado: 'abierto' });

// Convierte la fecha de la API al formato local del formulario.
function localDate(value) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

onMounted(async () => {
  // Con ID, carga el torneo para editarlo.
  if (!id) return;
  try {
    const { nombre, videojuego, modalidad, fechaInicio, cierreInscripcion, cupoMaximo, estado } = await api('/torneos/' + id);
    Object.assign(form, { nombre, videojuego, modalidad, fechaInicio: localDate(fechaInicio), cierreInscripcion: localDate(cierreInscripcion), cupoMaximo, estado });
    loaded.value = true;
  } catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
});

async function save() {
  error.value = '';
  // Avisa en el formulario si las fechas están en el orden incorrecto.
  if (form.cierreInscripcion >= form.fechaInicio) {
    error.value = 'Selecciona un cierre de inscripción anterior al inicio.';
    return;
  }
  loading.value = true;
  try {
    // Convierte las fechas locales a ISO en UTC al enviarlas.
    const body = { ...form, cierreInscripcion: new Date(form.cierreInscripcion).toISOString(), fechaInicio: new Date(form.fechaInicio).toISOString() };
    // Usa PATCH al editar y POST al crear.
    const saved = await api(id ? '/torneos/' + id : '/torneos', { method: id ? 'PATCH' : 'POST', body });
    await router.push({ path: '/torneos/' + saved.id, query: { guardado: '1' } });
  } catch (failure) { error.value = failure.message; }
  finally { loading.value = false; }
}
</script>

<template>
  <RouterLink to="/torneos">Volver a torneos</RouterLink>
  <h1>{{ id ? 'Editar torneo' : 'Crear torneo' }}</h1>
  <form v-if="loaded" class="panel stack" @submit.prevent="save">
    <label>Nombre <input v-model.trim="form.nombre" minlength="2" maxlength="100" required></label>
    <label>Videojuego <input v-model.trim="form.videojuego" minlength="2" maxlength="80" required></label>
    <label>Modalidad <select v-model="form.modalidad"><option>liga</option><option value="eliminacion">eliminación</option></select></label>
    <label>Inicio <input v-model="form.fechaInicio" type="datetime-local" required></label>
    <label>Cierre de inscripción <input v-model="form.cierreInscripcion" type="datetime-local" required></label>
    <label>Cupo <input v-model.number="form.cupoMaximo" type="number" min="2" max="512" required></label>
    <label>Estado <select v-model="form.estado"><option>abierto</option><option>cerrado</option><option>finalizado</option></select></label>
    <button :disabled="loading">Guardar torneo</button>
  </form>
  <Feedback :loading="loading" :error="error" />
</template>
