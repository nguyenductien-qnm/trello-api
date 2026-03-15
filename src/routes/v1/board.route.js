import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import BoardController from '~/controllers/board.controller'
import asyncHandler from '~/helpers/asyncHandler'
import validate from '~/utils/validate'
import { validateIdParamSchema } from '~/validations/commonValidation'

const Router = express.Router()

Router.route('/workspace/:workspaceId').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.fetchBoardByWorkspaceId)
)

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

Router.route('/roles').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.updateRole)
)

Router.route('/permissions').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.fetchBoardPermission)
)

Router.route('/roles/:_id').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.fetchBoardRole)
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
  // .delete(
  //   asyncHandler(authMiddleware.isAuthorized),
  //   asyncHandler(BoardController.delete)
  // )

Router.route('/supports/moving_card').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(boardValidation.moveCardToDifferentColumn)),
  asyncHandler(BoardController.moveCardToDifferentColumn)
)

Router.route('/members/:_id').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.fetchBoardMember)
)

Router.route('/roles').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.createRole)
)

Router.route('/roles/:roleId').delete(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.deleteRole)
)

Router.route('/status/:_id').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(BoardController.updateStatus)
)


export const boardRoute = Router
