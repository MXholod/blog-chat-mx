export default function({ $axios, store, redirect }){
  $axios.interceptors.request.use(req =>{
    if(store.getters['auth/isUserAuthenticated'].jwtToken && !req.headers.common['Authorization']){
      req.headers.common['Authorization'] = `Bearer ${store.getters['auth/isUserAuthenticated'].jwtToken}`;
    }
    return req;
  }, error => {
    // handle the error
    return Promise.reject(error);
  });

  const interceptor = $axios.interceptors.response.use(response => {
      if(process.server) {
        $axios.interceptors.response.eject(interceptor);
      }
      return response;
  }, error => {
    if(process.server) {
      $axios.interceptors.response.eject(interceptor);
    }
    // When Refresh-Token expired
    if (error.response.status === 401 && error.response.data.message) {
      store.commit('auth/userLogOut',{root: true});
      store.commit('error/setError','Your session is up',{root: true});
      redirect('/login');
    }
    // When Access-Token expired
    if (error.response.status === 401 && !error.response.data.message) {
      //store.dispatch('auth/refreshToken');
      $axios.$post('/api/auth/user/refresh').then(data =>{
        if(data){
          const { details : { jwtToken : activeToken } } = data;
          return activeToken;
        }
        throw data;
      }).then(activeToken => {
        $axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;
        store.commit('error/setError',
          {jwtRefreshed : 'Your session is extended, have a nice work!'},
          {root: true}
        );
        return error.config;
      }).catch(err => {
        return error;
      });
      return error.config;
    }
    return error;
    //return Promise.reject(error);
  });
}
