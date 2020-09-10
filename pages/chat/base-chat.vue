<template>
    <v-row justify="center" align="center">
        <v-col xs="12" md="8" lg="6">
            <h1>Visitor name is: {{ user.name }}</h1>
        </v-col>
    </v-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'chat/base-chat',
  middleware: ['chat'],
  computed: mapState(['user']),
  head () {
    return {
      title: `The room name is ${this.user.room}`
    }
  }
}
</script>
