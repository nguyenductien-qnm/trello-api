import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { cardModel } from '~/models/card.model'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'

class CardRepo {
  static findOneById = async ({ _id }) => {
    const result = await GET_DB()
      .collection(cardModel.CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(_id) })
    return result
  }

  static createOne = async ({ data }) => {
    const validData = await cardModel.validateBeforeCreate(data)
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }

    const createdCard = await GET_DB()
      .collection(cardModel.CARD_COLLECTION_NAME)
      .insertOne(newCardToAdd)
    return createdCard
  }

  static updateOne = async ({ _id, data }) => {
    if (data.columnId) data.columnId = new ObjectId(data.columnId)

    const result = await GET_DB()
      .collection(cardModel.CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: data },
        { returnDocument: 'after' }
      )

    return result
  }

  static deleteByColumnId = async ({ columnId }) => {
    const result = await GET_DB()
      .collection(cardModel.CARD_COLLECTION_NAME)
      .deleteMany({ columnId: new ObjectId(columnId) })
    return result
  }

  static unshiftNewComment = async ({ _id, data }) => {
    const result = await GET_DB()
      .collection(cardModel.CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $push: { comments: { $each: [data], $position: 0 } } },
        { returnDocument: 'after' }
      )
    return result
  }

  static updateMembers = async ({ _id, data }) => {
    let updateCondition = {}
    if (data.action === CARD_MEMBER_ACTIONS.ADD) {
      updateCondition = {
        $push: { memberIds: new ObjectId(data.userId) }
      }
    }

    if (data.action === CARD_MEMBER_ACTIONS.REMOVE) {
      updateCondition = {
        $pull: { memberIds: new ObjectId(data.userId) }
      }
    }

    const result = await GET_DB()
      .collection(cardModel.CARD_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(_id) }, updateCondition, {
        returnDocument: 'after'
      })
    return result
  }
}
export default CardRepo
