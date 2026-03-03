import express from 'express'
import { invitationValidation } from '~/validations/invitationValidation'
import { authMiddleware } from '~/middlewares/auth.middleware'
import InvitationController from '~/controllers/invitation.controller'

const Router = express.Router()

Router.route('/board').post(
  authMiddleware.isAuthorized,
  invitationValidation.createNewBoardInvitation,
  InvitationController.createNewBoardInvitation
)

Router.route('/').get(
  authMiddleware.isAuthorized,
  InvitationController.getInvitations
)

// Cập nhật một bản ghi Board Invitation
Router.route('/board/:invitationId').put(
  authMiddleware.isAuthorized,
  InvitationController.updateBoardInvitation
)

export const invitationRoute = Router
