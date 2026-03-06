import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { columnModel } from '~/models/column.model'

class ColumnRepo {
  static findById = async ({ _id }) => {
    const result = await GET_DB()
      .collection(columnModel.COLUMN_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(_id) })

    return result
  }

  static createOne = async ({ data }) => {
    const validData = await columnModel.validateBeforeCreate(data)

    const newColumnToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }

    const createdColumn = await GET_DB()
      .collection(columnModel.COLUMN_COLLECTION_NAME)
      .insertOne(newColumnToAdd)

    return createdColumn
  }

  static updateById = async ({ _id, data }) => {
    if (data.cardOrderIds)
      data.cardOrderIds = data.cardOrderIds.map((_id) => new ObjectId(_id))

    const result = await GET_DB()
      .collection(columnModel.COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: data },
        { returnDocument: 'after' }
      )

    return result
  }

  static pushCardOrderIds = async ({ card }) => {
    const result = await GET_DB()
      .collection(columnModel.COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(card.columnId) },
        { $push: { cardOrderIds: new ObjectId(card._id) } },
        { returnDocument: 'after' }
      )
    return result
  }

  static deleteById = async ({ _id }) => {
    const result = await GET_DB()
      .collection(columnModel.COLUMN_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(_id) })
    return result
  }
}
export default ColumnRepo
