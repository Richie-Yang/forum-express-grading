const { Restaurant, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getRestaurants: cb => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => cb(
        null, { restaurants }
      ))
      .catch(err => cb(err))
  },

  postRestaurant: (req, cb) => {
    const {
      name, tel, address, openingHours, description, categoryId
    } = req.body

    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    return imgurFileHandler(file)
      .then(filePath => {
        return Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null,
          categoryId
        })
      })
      .then(newRestaurant => {
        return cb(null, { restaurant: newRestaurant })
      })
      .catch(err => cb(err))
  },

  deleteRestaurant: (req, cb) => {
    const { id } = req.params

    return Restaurant.findByPk(id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exists")

        return restaurant.destroy()
      })
      .then(deletedRestaurant => {
        return cb(null, { restaurant: deletedRestaurant })
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices
