import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/board.model'
import { columnModel } from '~/models/column.model'
import { cardModel } from '~/models/card.model'

import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'

class BoardService {
  static getBoards = async (userId, page, itemsPerPage, queryFilters) => {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const results = await boardModel.getBoards(
      userId,
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      parseInt(queryFilters, 10)
    )

    return results
  }

  static getDetails = async (userId, boardId) => {
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    const resBoard = cloneDeep(board)

    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      )
    })

    delete resBoard.cards
    return resBoard
  }

  static createNew = async (userId, reqBody) => {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModel.createNew(userId, newBoard)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    return getNewBoard
  }

  static update = async (boardId, reqBody) => {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  }

  static moveCardToDifferentColumn = async (reqBody) => {
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Successfully!' }
  }
}

export default BoardService
