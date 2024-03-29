import { ROLES } from '../DAO/mongo/models/users.model.js'
import UserDTO from '../DAO/DTO/user.DTO.js'
import UserService from '../services/UserService.js'
import { transporter } from '../configuration/nodemailer.js'

class UserController {
  registrationLocal (req, res) {
    if (!req.user) {
      return res.json({ error: 'Could not register' })
    }
    // req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.name, lastName: req.user.lastName, currentCartId: req.user.currentCartId, role: req.user.role }

    res.status(200).json({ message: 'User registered' })
  }

  async loginLocal (req, res) {
    if (!req.user) {
      return res.json({ error: 'Invalid credentials' })
    }
    req.session.user = { ...req.user }
    await UserService.updateUser(req.session.user._id, {
      lastConnection: new Date()
    })
    res.redirect('/')
  }

  async loginGitHub (req, res) {
    if (!req.user) {
      return res.json({ error: 'Invalid credentials' })
    }
    req.session.user = { ...req.user }
    await UserService.updateUser(req.session.user._id, {
      lastConnection: new Date()
    })
    res.redirect('/')
  }

  currentSession (req, res) {
    const user = req.session.user
    const DTO = new UserDTO(user).build()
    res.json(DTO)
  }

  async deleteSession (req, res) {
    try {
      console.log({ user: req.session })
      await UserService.updateUser(req.session.user._id, {
        lastConnection: new Date()
      })
    } catch (err) {
      console.log('Session has been expired.')
    } finally {
      req.session.destroy()
      res.redirect('/login')
    }
  }

  async getAllUsers (req, res) {
    try {
      const users = await UserService.getUsers()
      const usersDto = users.map(user => new UserDTO(user).build())
      res.status(200).json(usersDto)
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error'
      })
    }
  }

  async deleteAllInactiveUsers (req, res) {
    try {
      const userEmailsDeleted = await UserService.deleteInactiveUsers()
      console.log({ userEmailsDeleted })
      transporter.sendMail({
        to: userEmailsDeleted,
        subject: 'Su cuenta ha sido desactivada por inactividad.',
        text: 'Buenos dias/tardes, su cuenta ha sido desactivada por inactividad.',
        textEncoding: 'utf-8'
      })
      res.status(204).send()
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error'
      })
    }
  }

  async upgradeUser (req, res) {
    try {
      const { uid } = req.params
      const updated = await UserService.updateUser(uid, {
        role: ROLES.USER_PREMIUM
      })
      const userDTO = new UserDTO(updated).build()
      res.status(200).json(userDTO)
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error'
      })
    }
  }
}

export default new UserController()
