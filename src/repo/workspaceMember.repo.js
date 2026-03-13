import { GET_DB } from '~/config/mongodb'
import { workspaceMemberModel } from '~/models/workspaceMember.model'

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
}
export default WorkspaceMemberRepo
