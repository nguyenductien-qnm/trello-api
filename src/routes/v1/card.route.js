import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import { multerUploadMiddleware } from '~/middlewares/multerUpload.middleware'
import CardController from '~/controllers/card.controller'

const Router = express.Router()

Router.route('/').post(
  authMiddleware.isAuthorized,
  cardValidation.createNew,
  CardController.createNew
)

Router.route('/:id').put(
  authMiddleware.isAuthorized,
  multerUploadMiddleware.upload.single('cardCover'),
  cardValidation.update,
  CardController.update
)

export const cardRoute = Router
