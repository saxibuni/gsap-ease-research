<template>
  <div id="app">
    <div class="container">
      <h1>GSAP轮盘抽奖</h1>
      <Wheel />
    </div>
  </div>
</template>

<script setup lang="ts">
import Wheel from './components/Wheel.vue'
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 20px;
}

h1 {
  color: #333;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
</style> 