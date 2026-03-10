import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const WORKSPACE_ROLE_COLLECTION_NAME = 'workspaceRoles'

const WORKSPACE_ROLE_COLLECTION_SCHEMA = Joi.object({
  workspaceId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  name: Joi.string().required().min(3).max(255).trim().strict(),

  permissionCodes: Joi.array().items(Joi.string().required()),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

export const workspaceRoleModel = {
  WORKSPACE_ROLE_COLLECTION_NAME,
  WORKSPACE_ROLE_COLLECTION_SCHEMA
}
