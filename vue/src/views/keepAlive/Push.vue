<script setup lang="ts">
import { ref, } from 'vue';
import { useRoute, useRouter, } from 'vue-router';

const route = useRoute();
const router = useRouter();

const num = ref('');

</script>

<template>
  <p>route.meta.cache: {{ route.meta?.cache }}</p>

  输入：<input v-model="num">

  <button @click="router.back()">
    返回
  </button>
</template>

<style lang="scss" scoped>
button{
  background-color: #eee;
  border-style: inherit;
  margin-left: 10px;
  margin-top: 10px;
}
input{
  border-style: solid;
}
</style>
