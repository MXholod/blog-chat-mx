export default function ({ store, redirect }) {
  //store.state.auth.user.login; //store.getters['auth/isUserAuthenticated'];
  if (store.getters['auth/isUserAuthenticated'].login === '') {
    return redirect('/login?message=unauthenticated');
  }
}
