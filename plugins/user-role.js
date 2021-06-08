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
  const allowedByRole = async (jwt) => {
  return await fetch(`${app.$http._defaults.prefixUrl}api/auth/user/role/${jwt}`).then((response)=>{
    return response.json();
  }).then((data)=>{
    //data - {message: "", role: ""}
    return data;
  }).catch((e)=>{
    return { message: 'Access denied', role: '' }
  });
  };
  inject('isAllowedByRole', allowedByRole);
}
