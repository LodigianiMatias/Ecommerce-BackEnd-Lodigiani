export default class UserDTO {
  constructor (user) {
    this.name = user.name
    this.lastname = user.lastname ? user.lastname : ''
    this.email = user.email
    this.currentCartId = user.currentCartId
    this.role = user.role
    this.lastConnection = user.lastConnection
    this.documents = user.documents
  }

  build () {
    return this
  }
}
