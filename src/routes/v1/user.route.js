import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import { multerUploadMiddleware } from '~/middlewares/multerUpload.middleware'
import UserController from '~/controllers/user.controller'
import asyncHandler from '~/helpers/asyncHandler'
import validate from '~/utils/validate'

const Router = express.Router()

Router.route('/register').post(
  asyncHandler(validate(userValidation.create)),
  asyncHandler(UserController.create)
)

Router.route('/verify').put(
  asyncHandler(validate(userValidation.verifyAccount)),
  asyncHandler(UserController.verifyAccount)
)

Router.route('/login').post(
  asyncHandler(validate(userValidation.login)),
  asyncHandler(UserController.login)
)

Router.route('/logout').delete(asyncHandler(UserController.logout))

Router.route('/refresh_token').put(asyncHandler(UserController.refreshToken))

Router.route('/update').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(multerUploadMiddleware.upload.single('avatar')),
  asyncHandler(validate(userValidation.update)),
  asyncHandler(UserController.update)
)

export const userRoute = Router
