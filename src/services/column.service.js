import { columnModel } from '~/models/column.model'
import { boardModel } from '~/models/board.model'
import { cardModel } from '~/models/card.model'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

class ColumnService {
  static createNew = async (reqBody) => {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []

      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  }

  static update = async (columnId, reqBody) => {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  }

  static deleteItem = async (columnId) => {
    const targetColumn = await columnModel.findOneById(columnId)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }

    await columnModel.deleteOneById(columnId)

    await cardModel.deleteManyByColumnId(columnId)

    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Column and its Cards deleted successfully!' }
  }
}
export default ColumnService
