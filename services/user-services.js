const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userServices = {
  signUp: (req, cb) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) throw new Error('Passwords do not match!')
    return User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(newCreatedUser => {
        newCreatedUser = newCreatedUser.toJSON()
        delete newCreatedUser.password
        return cb(null, { user: newCreatedUser })
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices
