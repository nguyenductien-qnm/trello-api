import { StatusCodes } from 'http-status-codes'
import InvitationService from '~/services/invitation.service'

class InvitationController {
  static createNewBoardInvitation = async (req, res, next) => {
    try {
      const inviterId = req.jwtDecoded._id
      const resInvitation = await InvitationService.createNewBoardInvitation(
        req.body,
        inviterId
      )

      res.status(StatusCodes.CREATED).json(resInvitation)
    } catch (error) {
      next(error)
    }
  }

  static getInvitations = async (req, res, next) => {
    try {
      const userId = req.jwtDecoded._id
      const resInvitation = await InvitationService.getInvitations(userId)
      res.status(StatusCodes.OK).json(resInvitation)
    } catch (error) {
      next(error)
    }
  }

  static updateBoardInvitation = async (req, res, next) => {
    try {
      const userId = req.jwtDecoded._id
      const { invitationId } = req.params
      const { status } = req.body
      const updatedInvitation = await InvitationService.updateBoardInvitation(
        userId,
        invitationId,
        status
      )
      res.status(StatusCodes.OK).json(updatedInvitation)
    } catch (error) {
      next(error)
    }
  }
}
export default InvitationController
