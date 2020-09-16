class Users {
  users
  constructor () {
    this.users = []
  }

  add (user) {
    this.users.push(user)
  }

  get (id) {
    return this.users.find( (user) => user.id === id )
  }

  remove (id) {
    const user = this.get(id)
    // If 'user' exists remove it
    if (user) {
      // Remove user if its 'id' isn't equal to 'id'
      this.users = this.users.filter( (user) => user.id !== id )
    }
    // Return deleted 'user'
    return user
  }

  // Get all users in the room
  getByRoom (room) {
    return this.users.filter( (user) => user.room === room )
  }
}

module.exports = function () {
  return new Users()
}
