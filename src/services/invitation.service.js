import { invitationModel } from '~/models/invitation.model'
import { INVITATION_TYPES, BOARD_INVITATION_STATUS } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'
import {
  BadRequestErrorResponse,
  NotFoundErrorResponse
} from '~/core/error.response'
import UserRepo from '~/repo/user.repo'
import BoardRepo from '~/repo/board.repo'
import InvitationRepo from '~/repo/invitation.repo'

class InvitationService {
  static createNewBoardInvitation = async ({ userContext, data }) => {
    const inviter = await UserRepo.findById({ _id: userContext._id })
    const invitee = await UserRepo.findByEmail({ email: data.inviteeEmail })
    const board = await BoardRepo.findById({ _id: data.boardId })

    if (!invitee || !inviter || !board)
      throw new NotFoundErrorResponse('Inviter, Invitee or Board not found!')

    const newInvitationData = {
      inviterId: inviter._id.toString(),
      inviteeId: invitee._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    const createdInvitation =
      await invitationModel.createNewBoardInvitation(newInvitationData)

    const getInvitation = await invitationModel.findOneById(
      createdInvitation.insertedId
    )

    const resInvitation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }

    return resInvitation
  }

  static getInvitations = async ({ userContext }) => {
    const invitations = await InvitationRepo.findByUser({
      userId: userContext._id
    })

    return invitations.map((i) => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || {}
    }))
  }

  static updateBoardInvitation = async ({ userId, invitationId, status }) => {
    const invitation = await InvitationRepo.findById({ _id: invitationId })
    if (!invitation) throw new NotFoundErrorResponse('Invitation not found!')

    const board = await BoardRepo.findById({
      _id: invitation.boardInvitation.boardId
    })
    if (!board) throw new NotFoundErrorResponse('Board not found!')

    const boardOwnerAndMemberIds = [
      ...board.ownerIds,
      ...board.memberIds
    ].toString()

    if (
      status === BOARD_INVITATION_STATUS.ACCEPTED &&
      boardOwnerAndMemberIds.includes(userId)
    )
      throw new BadRequestErrorResponse(
        'You are already a member of this board.'
      )

    const updateData = {
      boardInvitation: {
        ...invitation.boardInvitation,
        status: status
      }
    }

    const updatedInvitation = await InvitationRepo.updateById({
      _id: invitationId,
      data: updateData
    })

    console.log('updatedInvitation:::', updatedInvitation)

    if (
      updatedInvitation.boardInvitation.status ===
      BOARD_INVITATION_STATUS.ACCEPTED
    ) {
      console.log('update board member:::')
      await BoardRepo.pushMemberIds({
        _id: invitation.boardInvitation.boardId,
        userId
      })
    }
    return updatedInvitation
  }
}

export default InvitationService
