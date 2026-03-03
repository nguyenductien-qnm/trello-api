import { StatusCodes } from 'http-status-codes'
import BoardService from '~/services/board.service'

class BoardController {
  static getBoards = async (req, res, next) => {
    try {
      const userId = req.jwtDecoded._id
      const { page, itemsPerPage, q } = req.query
      const queryFilters = q
      const results = await BoardService.getBoards(
        userId,
        page,
        itemsPerPage,
        queryFilters
      )

      res.status(StatusCodes.OK).json(results)
    } catch (error) {
      next(error)
    }
  }

  static getDetails = async (req, res, next) => {
    try {
      const board = await BoardService.getDetails(
        req.jwtDecoded._id,
        req.params.id
      )
      res.status(StatusCodes.OK).json(board)
    } catch (error) {
      next(error)
    }
  }

  static createNew = async (req, res, next) => {
    try {
      const userId = req.jwtDecoded._id
      const createdBoard = await BoardService.createNew(userId, req.body)
      res.status(StatusCodes.CREATED).json(createdBoard)
    } catch (error) {
      next(error)
    }
  }

  static update = async (req, res, next) => {
    try {
      const boardId = req.params.id
      const updatedBoard = await BoardService.update(boardId, req.body)

      res.status(StatusCodes.OK).json(updatedBoard)
    } catch (error) {
      next(error)
    }
  }

  static moveCardToDifferentColumn = async (req, res, next) => {
    try {
      const result = await BoardService.moveCardToDifferentColumn(req.body)

      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }
}
export default BoardController
