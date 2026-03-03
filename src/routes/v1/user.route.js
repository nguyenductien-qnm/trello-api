import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import { multerUploadMiddleware } from '~/middlewares/multerUpload.middleware'
import UserController from '~/controllers/user.controller'

const Router = express.Router()

Router.route('/register').post(
  userValidation.createNew,
  UserController.createNew
)

Router.route('/verify').put(
  userValidation.verifyAccount,
  UserController.verifyAccount
)

Router.route('/login').post(userValidation.login, UserController.login)

Router.route('/logout').delete(UserController.logout)

Router.route('/refresh_token').put(UserController.refreshToken)

Router.route('/update').put(
  authMiddleware.isAuthorized,
  multerUploadMiddleware.upload.single('avatar'),
  userValidation.update,
  UserController.update
)

export const userRoute = Router
