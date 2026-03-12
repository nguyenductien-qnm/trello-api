import ColumnRepo from '~/repo/column.repo'
import BoardRepo from '~/repo/board.repo'
import CardRepo from '~/repo/card.repo'
import { NotFoundErrorResponse } from '~/core/error.response'

class ColumnService {
  static create = async ({ data }) => {
    const createdColumn = await ColumnRepo.createOne({ data })
    const column = await ColumnRepo.findById({
      _id: createdColumn.insertedId
    })

    if (column) {
      column.cards = []
      await BoardRepo.pushColumnOrderIds({ column })
    }

    return column
  }

  static update = async ({ _id, data }) => {
    const updateData = { ...data, updatedAt: Date.now() }

    const updatedColumn = await ColumnRepo.updateById({ _id, data: updateData })

    return updatedColumn
  }

  static deleteItem = async ({ _id }) => {
    const targetColumn = await ColumnRepo.findById({ _id })

    if (!targetColumn) throw new NotFoundErrorResponse('Column not found!')

    await ColumnRepo.deleteById({ _id })

    await CardRepo.deleteByColumnId({ columnId: _id })

    await BoardRepo.pullColumnOrderIds({ column: targetColumn })

    return {}
  }
}
export default ColumnService
