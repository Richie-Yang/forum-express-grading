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
  }
}

module.exports = adminServices
