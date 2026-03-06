import {
  CreatedSuccessResponse,
  OkSuccessResponse
} from '~/core/success.response'
import InvitationService from '~/services/invitation.service'

class InvitationController {
  static getInvitations = async (req, res) => {
    new OkSuccessResponse({
      metadata: await InvitationService.getInvitations({
        userContext: req.userContext
      })
    }).send(res)
  }

  static createNewBoardInvitation = async (req, res) => {
    new CreatedSuccessResponse({
      message: 'okk',
      metadata: await InvitationService.createNewBoardInvitation({
        userContext: req.userContext,
        data: req.body
      })
    }).send(res)
  }

  static updateBoardInvitation = async (req, res) => {
    const userId = req.userContext._id
    const { invitationId } = req.params
    const { status } = req.body
    new OkSuccessResponse({
      message: 'update success',
      metadata: await InvitationService.updateBoardInvitation({
        userId,
        invitationId,
        status
      })
    }).send(res)
  }
}
export default InvitationController
