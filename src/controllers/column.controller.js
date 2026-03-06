import {
  CreatedSuccessResponse,
  OkSuccessResponse
} from '~/core/success.response'
import ColumnService from '~/services/column.service'

class ColumnController {
  static create = async (req, res) => {
    new CreatedSuccessResponse({
      message: 'Create new column successfully!',
      metadata: await ColumnService.create({ data: req.body })
    }).send(res)
  }

  static update = async (req, res) => {
    new OkSuccessResponse({
      message: 'Update column successfully!',
      metadata: await ColumnService.update({
        _id: req.params._id,
        data: req.body
      })
    }).send(res)
  }

  static deleteItem = async (req, res) => {
    new OkSuccessResponse({
      message: 'Delete column successfully!',
      metadata: await ColumnService.deleteItem({ _id: req.params._id })
    }).send(res)
  }
}
export default ColumnController
