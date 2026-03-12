import SubscriptionRepo from '~/repo/subscription.repo'
import WorkspaceRepo from '~/repo/workspace.repo'
import WorkspaceMemberRepo from '~/repo/workspaceMember.repo'
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
}

export default WorkspaceService
