import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import BoardController from '~/controllers/board.controller'
import asyncHandler from '~/helpers/asyncHandler'
import validate from '~/utils/validate'
import { validateIdParamSchema } from '~/validations/commonValidation'

const Router = express.Router()

Router.route('/')
  .get(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(BoardController.getBoards)
  )
  .post(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(validate(boardValidation.create)),
    asyncHandler(BoardController.create)
  )

Router.route('/:_id')
  .get(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(validate(validateIdParamSchema, 'params')),
    asyncHandler(BoardController.getDetails)
  )
  .put(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(validate(validateIdParamSchema, 'params')),
    asyncHandler(validate(boardValidation.update)),
    asyncHandler(BoardController.update)
  )

Router.route('/supports/moving_card').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(boardValidation.moveCardToDifferentColumn)),
  asyncHandler(BoardController.moveCardToDifferentColumn)
)

export const boardRoute = Router
