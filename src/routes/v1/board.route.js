import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import BoardController from '~/controllers/board.controller'
import asyncHandler from '~/helpers/asyncHandler'

const Router = express.Router()

Router.route('/')
  .get(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(BoardController.getBoards)
  )
  .post(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(boardValidation.createNew),
    asyncHandler(BoardController.createNew)
  )

Router.route('/:id')
  .get(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(BoardController.getDetails)
  )
  .put(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(boardValidation.update),
    asyncHandler(BoardController.update)
  )

Router.route('/supports/moving_card').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(boardValidation.moveCardToDifferentColumn),
  asyncHandler(BoardController.moveCardToDifferentColumn)
)

export const boardRoute = Router
