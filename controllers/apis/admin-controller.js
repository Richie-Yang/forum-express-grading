const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(
      (err, data) => err
        ? next(err)
        : res.json({ status: 'success', message: data })
    )
  },

  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(
      req, (err, data) => err
        ? next(err)
        : res.json({ status: 'success', message: data })
    )
  }
}

module.exports = adminController
