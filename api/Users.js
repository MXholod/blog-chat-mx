class Users {
  users
  constructor () {
    this.users = []
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
