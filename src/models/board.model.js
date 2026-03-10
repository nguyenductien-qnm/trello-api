import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import {
  BOARD_STATUS,
  BOARD_TYPE,
  BOARD_VISIBILITY
} from '~/constant/enum/board.enum'

const BOARD_COLLECTION_NAME = 'boards'

const BOARD_COVER_SCHEMA = Joi.object({
  type: Joi.string().valid('color', 'image').required(),
  value: Joi.string().required().trim().strict()
}).default(null)

const BOARD_COLLECTION_SCHEMA = Joi.object({
  workspaceId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  title: Joi.string().required().min(3).max(50).trim().strict(),

  description: Joi.string()
    .min(3)
    .max(255)
    .trim()
    .strict()
    .allow('')
    .default(''),

  visibility: Joi.string()
    .required()
    .valid(...BOARD_VISIBILITY),

  type: Joi.string()
    .valid(...BOARD_TYPE)
    .default('normal'),

  cover: BOARD_COVER_SCHEMA,

  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdBy: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  status: Joi.string()
    .valid(...BOARD_STATUS)
    .default('active'),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA
}
