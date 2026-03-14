import { slugify } from '~/utils/formatters'
import { columnModel } from '~/models/column.model'
import { cloneDeep } from 'lodash'
import { NotFoundErrorResponse } from '~/core/error.response'
import BoardRepo from '~/repo/board.repo'
import CardRepo from '~/repo/card.repo'
import WorkspaceRepo from '~/repo/workspace.repo'
import { ObjectId } from 'mongodb'
import BoardRoleRepo from '~/repo/boardRole.repo'
import BoardMemberRepo from '~/repo/boardMember.repo'
import WorkspaceMemberRepo from '~/repo/workspaceMember.repo'
import { BOARD_MEMBER_STATUS } from '~/constant/enum/boardMember.enum'

const generateBoardRoleBase = ({ boardId }) => {
  return {
    boardId: boardId.toString(),
    name: 'Admin',
    permissionCodes: [
      'board.view',
      'board.update',
      'board.delete',
      'board.member.invite',
      'board.member.remove',
      'board.member.changeRole',
      'board.role.create',
      'board.role.update',
      'board.role.delete',
      'board.label.create',
      'board.label.update',
      'board.label.delete',
      'board.column.create',
      'board.column.update',
      'board.column.delete',
      'board.column.reorder',
      'board.card.create',
      'board.card.update',
      'board.card.delete',
      'board.card.move',
      'board.card.assignMember',
      'board.card.removeMember',
      'board.card.comment.create',
      'board.card.comment.update',
      'board.card.comment.delete',
      'board.card.attachment.create',
      'board.card.attachment.delete',
      'board.card.task.create',
      'board.card.task.update',
      'board.card.task.delete',
      'board.card.task.toggle',
      'board.activity.view'
    ]
  }
}

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
    const [boards, count] = await Promise.all([
      BoardRepo.findMany({
        filter: { workspaceId }
      }),
      BoardRepo.count({ filter: { workspaceId: new ObjectId(workspaceId) } })
    ])

    return { boards, count }
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

  static create = async ({ userContext, data, session = null }) => {
    const createBoardData = {
      ...data,
      createdBy: userContext._id
    }

    const createdBoard = await BoardRepo.createOne({ data: createBoardData })

    const createdBoardRole = await BoardRoleRepo.createOne({
      data: generateBoardRoleBase({ boardId: createdBoard.insertedId }),
      session
    })

    const workspaceMemberData = await WorkspaceMemberRepo.findOne({
      filter: {
        workspaceId: createBoardData.workspaceId
      }
    })

    const createdBoardMemberData = {
      boardId: createdBoard.insertedId.toString(),
      workspaceMemberId: workspaceMemberData._id.toString(),
      boardRoleId: createdBoardRole.insertedId.toString(),
      invitedBy: workspaceMemberData.userId.toString(),
      status: BOARD_MEMBER_STATUS[0],
      joinAt: Date.now()
    }

    await BoardMemberRepo.createOne({ data: createdBoardMemberData, session })

    const newBoard = await BoardRepo.findById({ _id: createdBoard.insertedId })

    return newBoard
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
