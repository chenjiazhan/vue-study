<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>counter: {{$store.state.counter}}</h2>
    <h3>getter: {{$store.getters.doubleCount}}</h3>
    <button @click="onClick">点击</button>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 10
    }
  },
  methods: {
    onClick() {
      this.$store.dispatch('add')
    }
  }
}
</script>
