<script setup lang="ts">
import { useRoute, } from 'vue-router';

const route = useRoute();

</script>

<template>
  <div class="routers">
    <router-link
      :to="{ name: 'eslint' }"
      class="router"
    >
      eslint 规范
    </router-link>
    <router-link
      :to="{ name: 'store' }"
      class="router"
    >
      pinia 计数器
    </router-link>
    <router-link
      :to="{ name: 'tsx' }"
      class="router"
    >
      tsx 计数器
    </router-link>
    <router-link
      :to="{ name: 'ajax' }"
      class="router"
    >
      {{ '请求' + ' + ' + '进度条' + '+ Mock' }}
    </router-link>
    <router-link
      :to="{ name: 'keepAlive' }"
      class="router"
    >
      KeepAliveVue3
    </router-link>
  </div>
  <keep-alive-vue3 :cache="route.meta?.cache" />
</template>

<style lang="scss">
.routers{
  .router{
    color: #646cff;
  }
  .router-link-active{
    color: #42b883;
  }
}
</style>

<style lang="scss" scoped>
.routers{
  margin-bottom: 100px;
}
.router{
  margin-right: 20px;
}
</style>
