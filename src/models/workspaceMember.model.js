import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { WORKSPACE_MEMBER_STATUS } from '~/constant/enum/workspaceMember.enum'

const WORKSPACE_MEMBER_COLLECTION_NAME = 'workspaceMembers'

const WORKSPACE_MEMBER_COLLECTION_SCHEMA = Joi.object({
  workspaceId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  workspaceRoleId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  invitedBy: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  status: Joi.string()
    .valid(...WORKSPACE_MEMBER_STATUS)
    .required(),

  joinAt: Joi.date().timestamp('javascript').default(null),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

export const workspaceMemberModel = {
  WORKSPACE_MEMBER_COLLECTION_NAME,
  WORKSPACE_MEMBER_COLLECTION_SCHEMA
}
