import { slugify } from '~/utils/formatters'
import { columnModel } from '~/models/column.model'
import { cardModel } from '~/models/card.model'
import { cloneDeep } from 'lodash'
import { NotFoundErrorResponse } from '~/core/error.response'
import BoardRepo from '~/repo/board.repo'

class BoardService {
  static getBoards = async ({ userContext, data }) => {
    const filters = {
      ...data,
      userId: userContext._id
    }

    const boards = await BoardRepo.getBoards({ filters })

    return boards
  }

  static getDetails = async ({ _id, userContext }) => {
    const filters = {
      _id,
      userId: userContext._id
    }

    const board = await BoardRepo.getDetails({ filters })

    if (!board) throw new NotFoundErrorResponse('Board not found!')

    const resBoard = cloneDeep(board)

    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      )
    })

    delete resBoard.cards
    return resBoard
  }

  static create = async ({ userContext, data }) => {
    const newBoard = {
      ...data,
      slug: slugify(data.title),
      userId: userContext._id
    }

    const createdBoard = await BoardRepo.createOne({ data: newBoard })

    const getNewBoard = await BoardRepo.findById({
      _id: createdBoard.insertedId
    })

    return getNewBoard
  }

  static update = async ({ _id, userContext, data }) => {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }

    const updatedBoard = await BoardRepo.updateOne({ _id, data: updateData })

    return updatedBoard
  }

  static moveCardToDifferentColumn = async ({ data }) => {
    await columnModel.update(data.prevColumnId, {
      cardOrderIds: data.prevCardOrderIds,
      updatedAt: Date.now()
    })

    await columnModel.update(data.nextColumnId, {
      cardOrderIds: data.nextCardOrderIds,
      updatedAt: Date.now()
    })

    await cardModel.update(data.currentCardId, {
      columnId: data.nextColumnId
    })

    return {}
  }
}

export default BoardService
