import Joi from 'joi'
import { SUBSCRIPTION_STATUS } from '~/constant/enum/subscription.enum'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const SUBSCRIPTION_COLLECTION_NAME = 'subscriptions'

const SUBSCRIPTION_COLLECTION_SCHEMA = Joi.object({
  workspaceId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  planId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  status: Joi.string()
    .valid(...SUBSCRIPTION_STATUS)
    .required(),

  startedAt: Joi.date().timestamp('javascript').default(null),
  endedAt: Joi.date().timestamp('javascript').default(null),
  canceledAt: Joi.date().timestamp('javascript').default(null),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

export const subscriptionModel = {
  SUBSCRIPTION_COLLECTION_NAME,
  SUBSCRIPTION_COLLECTION_SCHEMA
}
