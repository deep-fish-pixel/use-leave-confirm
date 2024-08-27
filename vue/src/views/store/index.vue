<script setup lang="ts">
import useCounterStore from '@/store/counterStore';
import { useLeaveConfirm } from "@/utils";
import {useRouter} from "vue-router";

const router = useRouter();

const store = useCounterStore();

const { snapshot, } = useLeaveConfirm(store);

</script>

<template>
  <h2>{{ store.count }}</h2>

  <button @click="store.increment()">
    增加
  </button>
  <button @click="store.decrement()">
    减少
  </button>
  <button @click="snapshot()">
    快照
  </button>
  <button @click="store.reset()">
    重置
  </button>
  <button @click="router.back()">
    后退
  </button>
  <button @click="router.forward()">
    前进
  </button>
  <button @click="router.replace('/ajax')">
    replace
  </button>
</template>

<style lang="scss" scoped>
button{
  background-color: #eee;
  border-style: inherit;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
