<template>
  <v-dialog v-model="dialog" persistent max-width="300">
    <v-card>
        <v-card-title>Message</v-card-title>
        <v-card-text>
            <v-container>
                <v-row justify="center">
                    <v-col class="text-center">
                        <v-progress-linear indeterminate color="teal" v-if="loading"></v-progress-linear>
                        <div v-else>{{ message }}</div>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  }
}
</script>

<style>

</style>
