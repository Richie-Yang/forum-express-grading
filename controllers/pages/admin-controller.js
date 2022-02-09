const { Restaurant, User, Category } = require('../../models')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(
      (err, data) => err
        ? next(err)
        : res.render('admin/restaurants', data)
    )
  },

  createRestaurant: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },

  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(
      req, (err, data) => {
        if (err) return next(err)
        req.flash('success_messages', 'Restaurant was successfully created')
        return res.redirect('/admin/restaurants', data)
      }
    )
  },

  getRestaurant: (req, res, next) => {
    const { id } = req.params

    return Restaurant.findByPk(id, { include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exists!")

        return res.render('admin/restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },

  editRestaurant: (req, res, next) => {
    const { id } = req.params

    return Promise.all([
      Restaurant.findByPk(id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant didn't exists")

        return res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    const { id } = req.params
    const {
      name, tel, address, openingHours, description, categoryId
    } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req
    return Promise.all([
      Restaurant.findByPk(id), imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exists")

        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant was successfully updated')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(
      req, (err, data) => {
        if (err) return next(err)
        req.flash('success_messages', 'Restaurant was successfully deleted')
        return res.redirect('/admin/restaurants', data)
      }
    )
  },

  getUsers: (req, res, next) => {
    return User.findAll({ raw: true, nest: true })
      .then(users => res.render('admin/users', { users }))
      .catch(err => next(err))
  },

  patchUser: async (req, res, next) => {
    try {
      const { id } = req.params

      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exists")

      const { email, isAdmin } = user.dataValues
      if (email === process.env.ROOT_EMAIL) {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }

      await user.update({ isAdmin: !isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (err) { next(err) }
  }
}

module.exports = adminController
