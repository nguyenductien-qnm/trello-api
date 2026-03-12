import { GET_DB } from '~/config/mongodb'
import { workspaceRoleModel } from '~/models/workspaceRole.model'

class WorkspaceRoleRepo {
  static createOne = async ({ data, session }) => {
    const validData = await workspaceRoleModel.validateBeforeCreate(data)
    return await GET_DB()
      .collection(workspaceRoleModel.WORKSPACE_ROLE_COLLECTION_NAME)
      .insertOne(validData, { session })
  }
}
export default WorkspaceRoleRepo
