import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import BoardController from '~/controllers/board.controller'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, BoardController.getBoards)
  .post(
    authMiddleware.isAuthorized,
    boardValidation.createNew,
    BoardController.createNew
  )

Router.route('/:id')
  .get(authMiddleware.isAuthorized, BoardController.getDetails)
  .put(
    authMiddleware.isAuthorized,
    boardValidation.update,
    BoardController.update
  )

// API hỗ trợ việc di chuyển card giữa các column khác nhau trong một board
Router.route('/supports/moving_card').put(
  authMiddleware.isAuthorized,
  boardValidation.moveCardToDifferentColumn,
  BoardController.moveCardToDifferentColumn
)

export const boardRoute = Router
