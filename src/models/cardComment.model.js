import Joi from 'joi'
import { COMMENT_STATUS } from '~/constant/enum/cardComment.enum'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const CARD_COMMENT_COLLECTION_NAME = 'cardComments'

const CARD_COMMENT_COLLECTION_SCHEMA = Joi.object({
  cardId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  boardMemberId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  content: Joi.string().required(),

  status: Joi.string()
    .valid(...COMMENT_STATUS)
    .default('active'),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

export const cardCommentModel = {
  CARD_COMMENT_COLLECTION_NAME,
  CARD_COMMENT_COLLECTION_SCHEMA
}
