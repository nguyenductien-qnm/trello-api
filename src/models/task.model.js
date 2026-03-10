import Joi from 'joi'
import { TASK_STATUS } from '~/constant/enum/task.status'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const TASK_COLLECTION_NAME = 'tasks'

const TASK_COLLECTION_SCHEMA = Joi.object({
  cardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  content: Joi.string().min(3).max(255).trim().strict().required(),

  parentTaskId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  childTaskOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  assigneeBoardMemberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  status: Joi.string()
    .valid(...TASK_STATUS)
    .default('pending'),

  dueAt: Joi.date().timestamp('javascript').default(null),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

export const taskModel = {
  TASK_COLLECTION_NAME,
  TASK_COLLECTION_SCHEMA
}
