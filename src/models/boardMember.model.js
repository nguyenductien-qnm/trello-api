import Joi from 'joi'
import { BOARD_MEMBER_STATUS } from '~/constant/enum/boardMember.enum'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const BOARD_MEMBER_COLLECTION_NAME = 'boardMembers'

const BOARD_MEMBER_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  workspaceMemberId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  boardRoleId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  invitedBy: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  status: Joi.string()
    .valid(...BOARD_MEMBER_STATUS)
    .required(),

  joinAt: Joi.date().allow(null).default(null),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().allow(null).default(null)
})

export const boardMemberModel = {
  BOARD_MEMBER_COLLECTION_NAME,
  BOARD_MEMBER_COLLECTION_SCHEMA
}
