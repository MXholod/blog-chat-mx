<template>
    <transition name="panel">
        <div v-if="showFirst || showSubsequent" class="chat-sport-content__system">
            <p>{{ systemMessage.title }}</p>
            <p>{{ systemMessage.text }}</p>
        </div>
    </transition>
</template>

<script>
export default {
  props: {
    systemMessage: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showFirst: true,
      showSubsequent: false,
      timeOut: null
    }
  },
  watch: {
    systemMessage (newVal, oldVal) {
      if (newVal.title && newVal.text && !this.showFirst) {
        this.showSubsequent = true
        this.hideSystemMessage('showSubsequent', 5000)
      }
    }
  },
  methods: {
    hideSystemMessage (property, time = 3000) {
      this.timeOut = setTimeout(function () {
        // Show system message
        this[property] = false
        if (this.timeOut !== null) {
          clearTimeout(this.timeOut)
          this.timeOut = null
        }
      }.bind(this), time)
    }
  },
  mounted () {
    this.hideSystemMessage('showFirst', 5000)
  }
}
</script>

<style lang="scss" scoped>
 .chat-sport-content__system{
    position:absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 10%;
    z-index: 1;
    border-bottom: 2px solid #fff;
    text-align: center;
    padding: 5px;
    color: #DCE6EE;
    background: #1863A4;
    box-shadow: 1px 1px 6px 3px #ccc;
  }
  .panel-enter-active, .panel-leave-active {
    transition: opacity .5s;
  }
  .panel-enter, .panel-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }
</style>
