import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import { multerUploadMiddleware } from '~/middlewares/multerUpload.middleware'
import asyncHandler from '~/helpers/asyncHandler'
import CardController from '~/controllers/card.controller'
import validate from '~/utils/validate'
import { validateIdParamSchema } from '~/validations/commonValidation'

const Router = express.Router()

Router.route('/').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(cardValidation.create)),
  asyncHandler(CardController.createNew)
)

Router.route('/:_id').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(validateIdParamSchema, 'params')),
  asyncHandler(multerUploadMiddleware.upload.single('cardCover')),
  asyncHandler(validate(cardValidation.update)),
  asyncHandler(CardController.update)
)

export const cardRoute = Router
