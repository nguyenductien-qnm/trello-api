import { ObjectId } from 'mongodb'
import {
  ConflictErrorResponse,
  NotFoundErrorResponse
} from '~/core/error.response'
import SubscriptionRepo from '~/repo/subscription.repo'
import WorkspaceRepo from '~/repo/workspace.repo'
import WorkspaceMemberRepo from '~/repo/workspaceMember.repo'
import WorkspacePermissionRepo from '~/repo/workspacePermission.repo'
import WorkspaceRoleRepo from '~/repo/workspaceRole.repo'

const generateWorkspaceRoleBase = ({ workspaceId }) => {
  return {
    workspaceId: workspaceId.toString(),
    name: 'Admin',
    permissionCodes: [
      'workspace.view',
      'workspace.update',
      'workspace.delete',
      'workspace.member.invite',
      'workspace.member.remove',
      'workspace.member.changeRole',
      'workspace.role.create',
      'workspace.role.update',
      'workspace.role.delete',
      'workspace.board.create.public',
      'workspace.board.create.workspaceVisible',
      'workspace.board.create.private',
      'workspace.board.delete.public',
      'workspace.board.delete.workspaceVisible',
      'workspace.board.delete.private'
    ]
  }
}

class WorkspaceService {
  static fetchByUser = async ({ userContext }) => {
    const workspaces = await WorkspaceRepo.findMany({
      filter: { ownerId: userContext._id.toString() }
    })

    if (!workspaces || !workspaces.length) return []

    return workspaces
  }

  static fetchWorkspaceInfo = async ({ _id, userContext }) => {
    const workspace = await WorkspaceRepo.findOne({
      filter: { _id: new ObjectId(_id) }
    })

    if (!workspace) throw new NotFoundErrorResponse('Workspace not found.')

    return workspace
  }

  static fetchWorkspaceMember = async ({ _id, data, userContext }) => {
    const workspaceMember = await WorkspaceMemberRepo.getMembers({
      filter: { workspaceId: _id },
      data
    })

    return workspaceMember
  }

  static fetchWorkspaceRole = async ({ _id, userContext }) => {
    const workspaceRoles = await WorkspaceRoleRepo.findMany({
      filter: { workspaceId: _id.toString() }
    })

    return workspaceRoles
  }

  static fetchWorkspacePermission = async () => {
    const workspacePermissions = await WorkspacePermissionRepo.findMany({})

    return workspacePermissions
  }

  static create = async ({ userContext, data, session = null }) => {
    const createWorkspaceData = { ownerId: userContext._id.toString(), ...data }

    const createdWorkspace = await WorkspaceRepo.createOne({
      data: createWorkspaceData,
      session
    })

    const createSubscriptionData = {
      workspaceId: createdWorkspace.insertedId.toString(),
      planId: createdWorkspace.insertedId.toString(),
      status: 'active',
      startedAt: Date.now()
    }

    const createdWorkspaceRole = await WorkspaceRoleRepo.createOne({
      data: generateWorkspaceRoleBase({
        workspaceId: createdWorkspace.insertedId
      }),
      session
    })

    const createMemberData = {
      workspaceId: createdWorkspace.insertedId.toString(),
      workspaceRoleId: createdWorkspaceRole.insertedId.toString(),
      invitedBy: null,
      userId: userContext._id.toString(),
      joinAt: Date.now()
    }

    await WorkspaceMemberRepo.createOne({
      data: createMemberData,
      session
    })

    await SubscriptionRepo.createOne({ data: createSubscriptionData, session })
  }

  static createRole = async ({ userContext, data }) => {
    const createdRole = await WorkspaceRoleRepo.createOne({ data })

    const role = await WorkspaceRoleRepo.findOne({
      filter: { _id: new ObjectId(createdRole.insertedId) }
    })

    return role
  }

  static updateRole = async ({ userContext, data }) => {
    const updatePromises = data.map((role) => {
      const { _id, ...rest } = role

      return WorkspaceRoleRepo.updateOne({
        filter: { _id: new ObjectId(_id) },
        data: { $set: { ...rest } }
      })
    })

    return await Promise.all(updatePromises)
  }

  static deleteRole = async ({ _id, userContext }) => {
    const deletedRole = await WorkspaceRoleRepo.deleteOne({
      filter: { _id: new ObjectId(_id) }
    })

    if (deletedRole.deletedCount === 0)
      throw new ConflictErrorResponse(
        'Role does not exist or has already been deleted.'
      )

    return {}
  }
}

export default WorkspaceService
