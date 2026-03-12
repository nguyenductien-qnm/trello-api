import { slugify } from '~/utils/formatters'
import { columnModel } from '~/models/column.model'
import { cloneDeep } from 'lodash'
import { NotFoundErrorResponse } from '~/core/error.response'
import BoardRepo from '~/repo/board.repo'
import CardRepo from '~/repo/card.repo'
import WorkspaceRepo from '~/repo/workspace.repo'
import { ObjectId } from 'mongodb'

class BoardService {
  static getBoardOverview = async ({ userContext, data }) => {
    const workspaces = await WorkspaceRepo.findMany({
      filter: { ownerId: userContext._id.toString() }
    })

    if (!workspaces || !workspaces.length) return []

    const workspaceIds = workspaces.map((w) => w._id.toString())

    const boards = await BoardRepo.findMany({
      filter: { workspaceId: { $in: workspaceIds } }
    })

    const result = workspaces.map((workspace) => {
      const workspaceId = workspace._id.toString()

      return {
        ...workspace,
        boards:
          boards?.filter((board) => board.workspaceId === workspaceId) || []
      }
    })

    return result
  }

  static fetchBoardByWorkspaceId = async ({ workspaceId, userContext }) => {
    const [workspace, boards, count] = await Promise.all([
      WorkspaceRepo.findOne({ filter: { _id: new ObjectId(workspaceId) } }),
      BoardRepo.findMany({
        filter: { workspaceId: new ObjectId(workspaceId) }
      }),
      BoardRepo.count({ filter: { workspaceId: new ObjectId(workspaceId) } })
    ])

    if (!workspace) throw new NotFoundErrorResponse('Workspace not found.')

    return { workspace, boards, count }
  }

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

    await CardRepo.updateOne({
      _id: data.currentCardId,
      data: { columnId: data.nextColumnId }
    })

    return {}
  }
}

export default BoardService
