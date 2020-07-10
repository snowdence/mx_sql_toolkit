//App.vue
<template>
  <div id="app">
    <NavBar />
    <HelloWorld/>
  </div>
</template>
<script>
 import HelloWorld from './components/HelloWorld.vue'
  import NavBar from './components/NavBar.vue';
  export default {
    components: {
      NavBar,
      HelloWorld
    }
  }
</script>