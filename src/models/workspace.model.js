import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { WORKSPACE_STATUS } from '~/constant/enum/workspace.enum'

const WORKSPACE_COLLECTION_NAME = 'workspaces'

const WORKSPACE_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),

  description: Joi.string()
    .min(3)
    .max(255)
    .trim()
    .strict()
    .allow('')
    .default(''),

  ownerId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  status: Joi.string()
    .valid(...WORKSPACE_STATUS)
    .required(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

export const workspaceModel = {
  WORKSPACE_COLLECTION_NAME,
  WORKSPACE_COLLECTION_SCHEMA
}
