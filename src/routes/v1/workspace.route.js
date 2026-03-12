import express from 'express'
import { authMiddleware } from '~/middlewares/auth.middleware'
import asyncHandler from '~/helpers/asyncHandler'
import WorkspaceController from '~/controllers/workspace.controller'

const Router = express.Router()

Router.route('/').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(WorkspaceController.fetchByUser)
)

Router.route('/members/:_id').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(WorkspaceController.fetchWorkspaceMember)
)

Router.route('/:_id').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(WorkspaceController.fetchWorkspaceInfo)
)

export const workspaceRoute = Router
