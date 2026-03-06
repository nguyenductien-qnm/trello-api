import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { boardModel } from '~/models/board.model'
import { userModel } from '~/models/user.model'
import {
  invitationModel,
  validateBeforeCreate
} from '~/models/invitation.model'

class InvitationRepo {
  static findById = async ({ _id }) => {
    const result = await GET_DB()
      .collection(invitationModel.INVITATION_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(_id) })
    return result
  }

  static findByUser = async ({ userId }) => {
    const queryConditions = [
      { inviteeId: new ObjectId(userId) },
      { _destroy: false }
    ]

    const result = await GET_DB()
      .collection(invitationModel.INVITATION_COLLECTION_NAME)
      .aggregate([
        { $match: { $and: queryConditions } },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'inviterId',
            foreignField: '_id',
            as: 'inviter',
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
          }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'inviteeId',
            foreignField: '_id',
            as: 'invitee',
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
          }
        },
        {
          $lookup: {
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: 'boardInvitation.boardId',
            foreignField: '_id',
            as: 'board'
          }
        }
      ])
      .toArray()

    return result
  }

  static createNewBoardInvitation = async ({ data }) => {
    const validData = await validateBeforeCreate(data)
    let newInvitationToAdd = {
      ...validData,
      inviterId: new ObjectId(validData.inviterId),
      inviteeId: new ObjectId(validData.inviteeId)
    }

    if (validData.boardInvitation) {
      newInvitationToAdd.boardInvitation = {
        ...validData.boardInvitation,
        boardId: new ObjectId(validData.boardInvitation.boardId)
      }
    }
    const createdInvitation = await GET_DB()
      .collection(invitationModel.INVITATION_COLLECTION_NAME)
      .insertOne(newInvitationToAdd)

    return createdInvitation
  }

  static updateById = async ({ _id, data }) => {
    if (data.boardInvitation)
      data.boardInvitation = {
        ...data.boardInvitation,
        boardId: new ObjectId(data.boardInvitation.boardId)
      }

    const result = await GET_DB()
      .collection(invitationModel.INVITATION_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: data },
        { returnDocument: 'after' }
      )

    return result
  }
}
export default InvitationRepo
