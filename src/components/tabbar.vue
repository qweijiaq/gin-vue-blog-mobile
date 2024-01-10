<template>
  <Tabbar v-model="tab" route>
    <TabbarItem icon="wap-home" name="index" to="/">首页</TabbarItem>
    <TabbarItem icon="manager" name="my" to="/mine">我的</TabbarItem>
  </Tabbar>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Tabbar, TabbarItem } from "vant";

const tab = ref("");
</script>

<style scoped lang="scss"></style>
