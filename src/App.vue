<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router';

</script>

<template>
    <UApp>

  <h1>Hello App!</h1>

  <UBadge icon="i-lucide-rocket" size="xl" color="primary" variant="solid">Badge</UBadge>

  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/about">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</UApp>
</template>  

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
