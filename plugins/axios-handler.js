export default function({ $axios, redirect, store }){
  $axios.onError(error => {
    if(error.response){
      //401 Unauthorized,  this sends with 'WWW-Authenticate' that contains information about authorization
      if(error.response.status === 401){
        store.dispatch('auth/logout');
        redirect('/login?message=session');
      }
      if(error.response.status === 500){
        console.error('Server Error is 500');
      }
    }
  });
}
