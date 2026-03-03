import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import ColumnController from '~/controllers/column.controller'

const Router = express.Router()

Router.route('/').post(
  authMiddleware.isAuthorized,
  columnValidation.createNew,
  ColumnController.createNew
)

Router.route('/:id')
  .put(
    authMiddleware.isAuthorized,
    columnValidation.update,
    ColumnController.update
  )
  .delete(
    authMiddleware.isAuthorized,
    columnValidation.deleteItem,
    ColumnController.deleteItem
  )

export const columnRoute = Router
