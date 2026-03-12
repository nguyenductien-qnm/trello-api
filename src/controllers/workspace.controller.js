import { OkSuccessResponse } from '~/core/success.response'
import WorkspaceService from '~/services/workspace.service'

class WorkspaceController {
  static fetchByUser = async (req, res) => {
    new OkSuccessResponse({
      metadata: await WorkspaceService.fetchByUser({
        userContext: req.userContext
      })
    }).send(res)
  }

  static fetchWorkspaceInfo = async (req, res) => {
    new OkSuccessResponse({
      metadata: await WorkspaceService.fetchWorkspaceInfo({
        _id: req.params._id,
        userContext: req.userContext
      })
    }).send(res)
  }

  static fetchWorkspaceMember = async (req, res) => {
    new OkSuccessResponse({
      metadata: await WorkspaceService.fetchWorkspaceMember({
        _id: req.params._id,
        data: req.query,
        userContext: req.userContext
      })
    }).send(res)
  }
}
export default WorkspaceController
