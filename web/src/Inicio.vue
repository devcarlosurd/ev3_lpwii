<script setup>
defineProps({ missing: Boolean });
</script>

<template>
  <section class="hero">
    <h1 v-if="missing">Página no encontrada</h1>
    <h1 v-else>Torneos IPVG</h1>
    <p v-if="missing"><RouterLink to="/">Volver al inicio</RouterLink></p>
    <p v-else>Encuentra competencias, arma tu equipo y consulta los resultados oficiales.</p>
  </section>
</template>
