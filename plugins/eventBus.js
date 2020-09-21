import Vue from 'vue'
export const eventBus = new Vue()
export default function ({ app }, inject) {
  // This is the same as Vue.prototype.$eventBus = new Vue()
  // inject('eventBus', new Vue());
  // Client only
  if (process.client) {
    // Event bus for plugins
    inject('eventBus', eventBus)
  }
}
