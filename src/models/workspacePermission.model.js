import Joi from 'joi'

const WORKSPACE_PERMISSION_COLLECTION_NAME = 'workspacePermissions'

const WORKSPACE_PERMISSION_COLLECTION_SCHEMA = Joi.object({
  permissionCode: Joi.string().required().min(3).max(50).trim().strict(),

  description: Joi.string().required().min(3).max(255).trim().strict(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

export const workspacePermissionModel = {
  WORKSPACE_PERMISSION_COLLECTION_NAME,
  WORKSPACE_PERMISSION_COLLECTION_SCHEMA
}
