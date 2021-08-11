class Users {
  users;
  usersInAllRooms = [];
  constructor () {
    this.users = []
  }

  getAllUsersInRooms(){
    return this.usersInAllRooms;
  }

  joinedToAllRooms(user){
    let doesUserExist = false;
    this.usersInAllRooms.forEach(userItem => {
      if(userItem.userId === user.userId){
        //User has been found in the array
        doesUserExist = true;
      }
    });
    //If user doesn't exist in the array add him to that array
    if(!doesUserExist){
      this.usersInAllRooms.push(user);
      //Should emit socket event
      return true;
    }
    //Shouldn't emit socket event
    return false;
  }

  leftFromAllRooms(user){
    if(this.usersInAllRooms.length > 0){
      const newUsersInAllRooms = this.usersInAllRooms.filter(userItem => {
        return userItem.userId !== user.userId;
      });
      //If true then one user has been deleted it means he left the chat
      if(newUsersInAllRooms.length !== this.usersInAllRooms.length){
        this.usersInAllRooms = newUsersInAllRooms;
        //Should emit socket event
        return true;
      }else{
        //Shouldn't emit socket event
        return false;
      }
    }
  }

  add (user) {
    this.users.push(user)
  }

  get (id) {
    //return this.users.find( (user) => user.socketId === id )
    return this.users.find( (user) => user.userId === id )
  }

  remove (id) {
    const user = this.get(id)
    // If 'user' exists remove it
    if (user) {
      // Remove user if its 'id' isn't equal to 'id'
      //this.users = this.users.filter( (user) => user.socketId !== id )
      this.users = this.users.filter( (user) => user.userId !== id )
    }
    // Return deleted 'user'
    return user
  }

  // Get all users in the room
  getByRoom (room) {
    return this.users.filter( (user) => user.room === room )
  }
  //Remove user by socket ID when he close the tab or window
  removeBySocketId(socketId){
    const user = this.users.find(user => user.socketId === socketId);
    this.users = this.users.filter(user => user.socketId !== socketId);
    return user;
  }
}

module.exports = function () {
  return new Users()
}
