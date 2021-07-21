/*Using the inject method. In components we can use it as follows:
export default {
  mounted(){
    this.$myInjectedFunction('works in mounted')
  },
  asyncData(context){
    context.app.$myInjectedFunction('works with context')
  }
}
//
plugins: [ ..., { src: '~/plugins/user-role' }, ... ],
*/
export default ({ app }, inject) => {
  const allSiteOptions = async (jwt) => {
  return await fetch(`${app.$http._defaults.prefixUrl}api/settings/admin/options/${jwt}`).then((response)=>{
    return response.json();
  }).then((data)=>{
    //data - { siteLogo: '' }
    return data;
  }).catch((e)=>{
    //console.log("Error ",e.message);
  });
  };
  inject('getAllSiteOptions', allSiteOptions);
}
