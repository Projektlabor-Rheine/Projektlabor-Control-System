const controller = require('../controllers/userPermission')
const validate = require('../controllers/userPermission.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
    session: false
})
const trimRequest = require('trim-request')

/*
 * UserPermission routes
 */

/*
 * Get item route
 */
router.get(
    '/:id',
    requireAuth,
    AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    validate.getItem,
    controller.getItem
)

router.post(
    '/',
    requireAuth,
    AuthController.roleAuthorization(['admin']),
    trimRequest.all,
    controller.createItem
)


module.exports = router