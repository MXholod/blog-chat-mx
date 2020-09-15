<template>
  <v-card
    max-width="800"
    class="mx-auto"
  >
    <v-list three-line v-if="name === 'admin'">
      <v-subheader
        v-if="header"
        v-text="header"
      ></v-subheader>
      <v-list-item
        @click.prevent=""
      >
        <v-list-item-avatar v-if="avatar">
          <v-img :src="avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="title"></v-list-item-title>
          <v-list-item-subtitle v-html="subtitle"></v-list-item-subtitle>
          <v-list-item-subtitle v-html="name"></v-list-item-subtitle>
          <v-list-item-subtitle v-html="text"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider
        v-if="divider"
        :inset="inset"
      ></v-divider>
    </v-list>

    <v-list three-line v-else class="user" :class="{ owner }">
      <v-subheader
        v-if="header"
        v-text="header"
      ></v-subheader>
      <v-list-item
        @click.prevent=""
      >
        <v-list-item-avatar v-if="avatar">
          <v-img :src="avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="title"></v-list-item-title>
          <v-list-item-subtitle v-html="subtitle"></v-list-item-subtitle>
          <v-list-item-subtitle v-html="name"></v-list-item-subtitle>
          <v-list-item-subtitle v-html="text"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider
        v-if="divider"
        :inset="inset"
      ></v-divider>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    header: { type: String, default: '' },
    title: String,
    subtitle: String,
    avatar: String,
    divider: { type: Boolean, default: false },
    inset: { type: Boolean, default: false },
    name: String,
    text: String,
    owner: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.owner {
  background-color: #f6f6f6 !important;
  color: #000 !important;
}
</style>
