<template>
    <div>
            <v-card
              max-width="800"
              class="mx-auto"
            >
              <v-list three-line>
                <template v-for="(item, index) in messages">
                  <v-subheader
                    v-if="item.header"
                    :key="item.header"
                    v-text="item.header"
                  ></v-subheader>

                  <v-divider
                    v-else-if="item.divider"
                    :key="index"
                    :inset="item.inset"
                  ></v-divider>

                  <v-list-item
                    v-else
                    :key="item.title"
                    @click.prevent=""
                  >
                    <v-list-item-avatar>
                      <v-img :src="item.avatar"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title v-html="item.title"></v-list-item-title>
                      <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'chat/base-chat',
  middleware: ['chat'],
  computed: mapState(['user', 'messages']),
  head () {
    return {
      title: `The room name is ${this.user.room}`
    }
  }
}
</script>
