<template>
  <div class="social-buttons">
    <ShareNetwork
      v-for="network in networks"
      :network="network.network"
      :key="network.network"
      :style="{backgroundColor: network.color}"
      :url="url"
      :title="title"
      @open="setSharingData"
      ref="share"
    >
      <span>{{ network.network }}</span>
      <font-awesome-icon :icon="network.icon" class="text-white fa-fw fa-lg" />
    </ShareNetwork>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title:'',
      url: '',
      networks: [
        { network: 'facebook', icon: ['fab', 'facebook-f'], color: '#1877f2' },
        { network: 'twitter', icon: ['fab', 'twitter'], color: '#1da1f2' },
        { network: 'pinterest', icon: ['fab', 'pinterest'], color: '#bd081c' },
        { network: 'telegram', icon: ['fab', 'telegram-plane'], color: '#0088cc' },
        { network: 'whatsapp', icon: ['fab', 'whatsapp'], color: '#25d366' },
      ]
    }
  },
  computed: {
    //If route is changed this computed property will change too
    routeChanges(){
      return this.$route.fullPath;
    }
  },
  watch:{
    //Watch for the computed property above to get the current page route and title
    routeChanges(curr, next){
      window.setTimeout(()=>{
        this.url = this.$config.baseURL+''+this.$route.fullPath; //process.env.baseUrl
        this.title = this.$meta().resume().metaInfo.title;
      //console.log("Route ",curr, "  ",next," ",this.$meta().resume().metaInfo.title);
      },1000);
    }
  },
  methods:{
    setSharingData(){
      this.url = this.$config.baseURL+''+this.$route.fullPath; //process.env.baseUrl
      this.title = this.$meta().resume().metaInfo.title;
      console.log("Tets ",this.title);
    }
  },
  mounted(){
    this.url = this.$config.baseURL+''+this.$route.fullPath; //process.env.baseUrl
    this.title = this.$meta().resume().metaInfo.title;
  }
}
</script>

<style lang="scss" scoped>
.social-buttons{
  width: 50%;
  margin: 0% auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  a{
    text-decoration: none;
    font-size: .8em;
    color: #fff;
    border: 1px solid #f3f3f3;
    padding: 2px 10px;
  }
}
</style>
