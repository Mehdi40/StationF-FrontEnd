<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      msg: 'Welcome to Station F booking web app.',
    };
  },
};
</script>

<style scoped>
h1 {
  font-weight: normal;
}
</style>
