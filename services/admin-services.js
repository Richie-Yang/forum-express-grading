const { Restaurant, Category } = require('../models')

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
