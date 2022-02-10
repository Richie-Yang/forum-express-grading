const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../../config/passport')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signin)

router.use('/', apiErrorHandler)

module.exports = router
