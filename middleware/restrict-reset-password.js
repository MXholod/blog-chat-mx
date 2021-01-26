export default async function({ query, redirect, app }){
  //query.token - 245d9bb015ea16b
  const reg = /^[A-Za-z0-9]{15}$/g;
  if(!query.token) return redirect('/register');//302 by default
  let isCorrectToken = reg.test(query.token.trim());
  if(isCorrectToken){
    try{
      const tokenResetPassword = await app.$axios.$post('/api/user/check-reset-password', {
        token: query.token
      });
      //resetPassword - true | false
      if(!tokenResetPassword.resetPassword){
        //Token date is expired.
        return redirect('/forgot-password');//302 by default
      }
    }catch(e){
      //Token date is expired.
      return redirect('/forgot-password');//302 by default
    }
  }else{
    //Token is incorrect
    return redirect('/register');//302 by default
  }
}
