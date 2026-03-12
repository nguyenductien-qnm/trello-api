import {
  CreatedSuccessResponse,
  OkSuccessResponse
} from '~/core/success.response'
import BoardService from '~/services/board.service'

class BoardController {
  static fetchBoardByWorkspaceId = async (req, res) => {
    new OkSuccessResponse({
      metadata: await BoardService.fetchBoardByWorkspaceId({
        workspaceId: req.params.workspaceId,
        userContext: req.userContext
      })
    }).send(res)
  }

  static getBoards = async (req, res) => {
    new OkSuccessResponse({
      metadata: await BoardService.getBoards({
        userContext: req.userContext,
        data: req.query
      })
    }).send(res)
  }

  static getBoardOverview = async (req, res) => {
    new OkSuccessResponse({
      metadata: await BoardService.getBoardOverview({
        userContext: req.userContext,
        data: req.query
      })
    }).send(res)
  }

  static getDetails = async (req, res) => {
    new OkSuccessResponse({
      metadata: await BoardService.getDetails({
        _id: req.params._id,
        userContext: req.userContext
      })
    }).send(res)
  }

  static create = async (req, res) => {
    new CreatedSuccessResponse({
      metadata: await BoardService.create({
        userContext: req.userContext,
        data: req.body
      })
    }).send(res)
  }

  static update = async (req, res) => {
    new OkSuccessResponse({
      metadata: await BoardService.update({
        _id: req.params._id,
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
