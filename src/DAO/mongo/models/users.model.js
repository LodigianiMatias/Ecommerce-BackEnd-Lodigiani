import { Schema, model } from 'mongoose'

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  USER_PREMIUM: 'user_premium'
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/gm.test(v)
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: ROLES.USER,
    enum: [ROLES.USER, ROLES.ADMIN, ROLES.USER_PREMIUM]
  },
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String
  },
  age: {
    type: Number
  },
  currentCartId: {
    type: String,
    required: false
  },
  lastConnection: {
    type: Date,
    required: false,
    default: null
  },
  documents: {
    type: [{
      name: {
        type: String,
        required: true
      },
      reference: {
        type: String,
        required: true
      }
    }],
    required: false,
    default: []
  }
}, { versionKey: false, timestamps: true })

export const UsersModel = model('Users', userSchema)
