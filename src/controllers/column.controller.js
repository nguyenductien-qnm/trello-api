import { StatusCodes } from 'http-status-codes'
import ColumnService from '~/services/column.service'

class ColumnController {
  static createNew = async (req, res, next) => {
    try {
      const createdColumn = await ColumnService.createNew(req.body)
      res.status(StatusCodes.CREATED).json(createdColumn)
    } catch (error) {
      next(error)
    }
  }

  static update = async (req, res, next) => {
    try {
      const columnId = req.params.id
      const updatedColumn = await ColumnService.update(columnId, req.body)

      res.status(StatusCodes.OK).json(updatedColumn)
    } catch (error) {
      next(error)
    }
  }

  static deleteItem = async (req, res, next) => {
    try {
      const columnId = req.params.id
      const result = await ColumnService.deleteItem(columnId)

      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }
}
export default ColumnController
