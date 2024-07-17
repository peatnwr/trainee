<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #app {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #4DB6AC;
    }

    .v-application--wrap {
      width: 100%;
    }
</style>
