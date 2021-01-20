const jwt = require('jsonwebtoken')
const userModel = require('../models/user')
const permModel = require('../models/permission')
const userPermissionsAccessModel = require('../models/userPermissionAccess')
const utils = require('../middleware/utils')
const permissioner = require('../middleware/permissioner')
const {matchedData} = require('express-validator')
const auth = require('../middleware/auth')
const db = require('../middleware/db')

/**
 * Add a new Permission Access to database
 * @param user
 * @param {Object} req - request object
 */
const createAccessItem = async req => {
    return new Promise((resolve, reject) => {
        const userPermissionsAccess = new userPermissionsAccessModel({
            userid: req.userid,
            userNameCache: req.userNameCache,
            permissionId: req.permissionId,
            permissionNameCache: req.permissionNameCache
        })
        userPermissionsAccess.save((err, item) => {
            if (err) {
                reject(utils.buildErrObject(422, err.message))
            }
            resolve(item)
        })
    })
}

/**
 * Finds user by ID
 * @param userId
 */
const findUserById = async userId => {
    return new Promise((resolve, reject) => {
        userModel.findById(userId, (err, item) => {
            utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
            resolve(item)
        })
    })
}

exports.createItem = async (req, res) => {
    try {
        const user = await findUserById(req.user._id)
        const data = matchedData(req);
        if (data.permissionId !== undefined) data.perm = await permissioner.permissionGetById(data.permissionId)
        if (data.permission !== undefined) data.perm = await permissioner.permissionGetByName(data.permission)
        data.userid = user._id
        data.userNameCache = user.name
        data.permissionNameCache = data.perm.permission
        data.permissionId = data.perm._id
        const permission = await permissioner.permissionIsAssigned(user, data.perm._id,'PERMISSION_IS_NOT_ASSIGNED')
        await permissioner.permissionIsRevokedActive(user, permission._id, 'PERMISSION_REVOKE_IS_NOT_ASSIGNED', true)
        //check if Machine is in use(add machiner)
        //unlock Machine
        const resolve = await createAccessItem(data)
        res.status(201).json(resolve)
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.closeItem = async (req, res) => {
    try {
        const data = {status: "error function not ready"}
        // add everything smile
        res.status(201).json(data)
    } catch (error) {
        utils.handleError(res, error)
    }
}