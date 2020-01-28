<template>
  <v-bottom-sheet v-model="sheet">
    <template #activator="{ on }">
      <v-btn
        color="primary"
        fab
        fixed
        bottom
        right
        v-on="on"
      >
        <v-icon>{{ $icons.mdiMenu }}</v-icon>
      </v-btn>
    </template>
    <slot />
  </v-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
class ActionsSheet extends Vue {
  sheet = false
}
export default ActionsSheet
</script>
