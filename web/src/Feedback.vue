<script setup>
defineProps({ loading: Boolean, error: String, success: String, empty: String });
</script>

<template>
  <p v-if="loading" role="status">Cargando…</p>
  <p v-else-if="error" role="alert" class="error">{{ error }}</p>
  <p v-else-if="success" role="status" class="success">{{ success }}</p>
  <p v-else-if="empty" role="status">{{ empty }}</p>
</template>
