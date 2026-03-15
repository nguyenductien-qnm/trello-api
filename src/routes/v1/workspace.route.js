import express from 'express'
import { authMiddleware } from '~/middlewares/auth.middleware'
import asyncHandler from '~/helpers/asyncHandler'
import WorkspaceController from '~/controllers/workspace.controller'

const Router = express.Router()

Router.route('/').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(WorkspaceController.fetchByUser)
)

Router.route('/permissions').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(WorkspaceController.fetchWorkspacePermission)
)

Router.route('/roles/:_id').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(WorkspaceController.fetchWorkspaceRole)
)

Router.route('/members/:_id').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(WorkspaceController.fetchWorkspaceMember)
)

Router.route('/roles').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(WorkspaceController.createRole)
)

Router.route('/roles').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(WorkspaceController.updateRole)
)

Router.route('/roles/:roleId').delete(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(WorkspaceController.deleteRole)
)

Router.route('/:_id')
  .get(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(WorkspaceController.fetchWorkspaceInfo)
  )
  .post(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(WorkspaceController.update)
  )
  .delete(
    asyncHandler(authMiddleware.isAuthorized),
    asyncHandler(WorkspaceController.delete)
  )

export const workspaceRoute = Router
