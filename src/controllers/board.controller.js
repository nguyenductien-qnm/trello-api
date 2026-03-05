import {
  CreatedSuccessResponse,
  OkSuccessResponse
} from '~/core/success.response'
import BoardService from '~/services/board.service'

class BoardController {
  static getBoards = async (req, res) => {
    new OkSuccessResponse({
      metadata: await BoardService.getBoards({
        userContext: req.userContext,
        data: req.query
      })
    }).send(res)
  }

  static getDetails = async (req, res) => {
    new OkSuccessResponse({
      metadata: await BoardService.getDetails({
        _id: req.params.id,
        userContext: req.userContext
      })
    }).send(res)
  }

  static createNew = async (req, res) => {
    new CreatedSuccessResponse({
      metadata: await BoardService.createNew({
        userContext: req.userContext,
        data: req.body
      })
    }).send(res)
  }

  static update = async (req, res) => {
    new OkSuccessResponse({
      metadata: await BoardService.update({
        _id: req.params.id,
        userContext: req.userContext,
        data: req.body
      })
    }).send(res)
  }

  static moveCardToDifferentColumn = async (req, res) => {
    new OkSuccessResponse({
      metadata: await BoardService.moveCardToDifferentColumn({ data: req.body })
    }).send(res)
  }
}
export default BoardController
