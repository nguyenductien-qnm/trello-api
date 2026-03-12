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
}
export default WorkspaceController
