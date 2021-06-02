export default async function({ redirect, app }){
  try{
    const result = await app.$axios.$get('/api/auth/user/role');
    const role = result.role;
    if(role !== '' || role !== 'guest' || role !== 'admin' || role !== 'moderator'){
      switch(role){
        case '' : return redirect('/login?message=unauthenticated');
        case 'guest': return redirect('/cabinet');
        //default: console.log(result.message);//admin or moderator
      }
    }else{
      throw new Error("Request failed");
    }
  }catch(e){
    return redirect('/');//302 by default
  }
}
