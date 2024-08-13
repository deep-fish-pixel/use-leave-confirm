<script setup lang="ts">
import useUserStore from '@/store/userStore';

const userStore = useUserStore();

function login() {
  userStore.login();
}

function getUserInfo() {
  userStore.getUserInfo();
}
</script>

<template>
  <p class="login">
    <button
      v-if="!userStore.getAccount"
      @click="login"
    >
      登录
    </button>
    <span
      v-else
      class="success"
    >account: {{ userStore.getAccount }}
    </span>
  </p>
  <p v-if="!userStore.getUser.username">
    <button @click="getUserInfo">
      获取用户信息
    </button>
  </p>
  <div
    v-else
    class="success"
  >
    <div>用户信息</div>
    {{ userStore.getUser }}
  </div>
  <button @click="userStore.reset()">
    重置
  </button>
  <p>
    <a
      target="_blank"
      href="https://www.npmjs.com/package/vite-plugin-mock-dev-server"
    >Typescript Mock</a>
  </p>
</template>

<style lang="scss" scoped>
.login{
  .success{
    color: darkgreen;
  }
}

button{
  background-color: #eee;
  border-style: inherit;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
