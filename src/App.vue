<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
    <main-tab-bar/>
  </div>
</template>
<script>
  import MainTabBar from "@/components/content/mainTabBar/MainTabBar";
  export default {
    name:'app',
    components:{
      MainTabBar
    }
  }
</script>

<style>
@import "./assets/css/normalize.css";

</style>
