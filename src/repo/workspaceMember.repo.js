import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/user.model'
import { workspaceMemberModel } from '~/models/workspaceMember.model'
import { workspaceRoleModel } from '~/models/workspaceRole.model'

class WorkspaceMemberRepo {
  static createOne = async ({ data, session }) => {
    const validData = await workspaceMemberModel.validateBeforeCreate(data)

    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .insertOne(validData, { session })
  }

  static findOne = async ({ filter, option = {} }) => {
    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .findOne(filter, option)
  }

  static findMany = async ({ filter, options = {} }) => {
    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .find(filter, options)
      .toArray()
  }

  static getMembers = async ({ filter, data, options = {} }) => {
    const { sort = { createdAt: -1 }, skip = 0, limit = 50 } = options
    const { search = '' } = data

    return await GET_DB()
      .collection(workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME)
      .aggregate([
        { $match: filter },

        {
          $addFields: {
            userObjectId: { $toObjectId: '$userId' },
            workspaceRoleObjectId: { $toObjectId: '$workspaceRoleId' }
          }
        },

        {
          $lookup: {
            from: workspaceRoleModel.WORKSPACE_ROLE_COLLECTION_NAME,
            localField: 'workspaceRoleObjectId',
            foreignField: '_id',
            as: 'role'
          }
        },
        {
          $unwind: {
            path: '$role',
            preserveNullAndEmptyArrays: true
          }
        },

        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true
          }
        },

        // Search sau khi đã lookup user
        ...(search
          ? [
              {
                $match: {
                  $or: [
                    { 'user.email': { $regex: search, $options: 'i' } },
                    { 'user.displayName': { $regex: search, $options: 'i' } }
                  ]
                }
              }
            ]
          : []),

        {
          $project: {
            _id: 1,
            status: 1,
            joinAt: 1,
            role: {
              name: '$role.name'
            },
            user: {
              displayName: '$user.displayName',
              email: '$user.email',
              avatar: '$user.avatar'
            }
          }
        },

        { $sort: sort },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray()
  }
}
export default WorkspaceMemberRepo
