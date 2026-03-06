import express from 'express'
import { invitationValidation } from '~/validations/invitationValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import InvitationController from '~/controllers/invitation.controller'
import validate from '~/utils/validate'
import asyncHandler from '~/helpers/asyncHandler'

const Router = express.Router()

Router.route('/board').post(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(validate(invitationValidation.createNewBoardInvitation)),
  asyncHandler(InvitationController.createNewBoardInvitation)
)

Router.route('/').get(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(InvitationController.getInvitations)
)

// Cập nhật một bản ghi Board Invitation
Router.route('/board/:invitationId').put(
  asyncHandler(authMiddleware.isAuthorized),
  asyncHandler(InvitationController.updateBoardInvitation)
)

export const invitationRoute = Router
