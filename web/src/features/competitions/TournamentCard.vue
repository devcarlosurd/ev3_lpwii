<script setup>
defineProps({ tournament: { type: Object, required: true } });
defineEmits(['detail']);
</script>

<template>
  <article class="item">
    <p class="muted">{{ tournament.videojuego }} · {{ tournament.modalidad }}</p>
    <h2>{{ tournament.nombre }}</h2>
    <p>{{ tournament.estado }} · {{ tournament.cupoMaximo }} equipos</p>
    <button type="button" @click="$emit('detail', tournament.id)">Ver torneo</button>
  </article>
</template>
