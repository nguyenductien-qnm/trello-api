import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import ColumnController from '~/controllers/column.controller'
import asyncHandler from '~/helpers/asyncHandler'
import validate from '~/utils/validate'
import { validateIdParamSchema } from '~/validations/commonValidation'

const Router = express.Router()

Router.route('/').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(columnValidation.create)),
  asyncHandler(ColumnController.create)
)

Router.route('/:_id')
  .put(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(validate(validateIdParamSchema, 'params')),
    asyncHandler(validate(columnValidation.update)),
    asyncHandler(ColumnController.update)
  )
  .delete(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(validate(validateIdParamSchema, 'params')),
    asyncHandler(ColumnController.deleteItem)
  )

export const columnRoute = Router
