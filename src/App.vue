<script setup>
import Siders from '@/components/Siders.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
const route = useRoute();
const isResultFlow = computed(() => route.path !== '/resultflow');

console.log('Current route:', route.path); // 添加这行来调试
console.log('Show sidebar:', isResultFlow.value); // 添加这行来调试
</script>

<template>
 <div id="app">
    <!-- 如果当前路径是resultflow 则显示侧边栏，否则显示主内容区域 -->
    <Siders v-if="isResultFlow"></Siders>
    <router-view v-else></router-view>
  </div>
</template>

<style >

body{
  margin: 0;
  padding: 0;
}


</style>
