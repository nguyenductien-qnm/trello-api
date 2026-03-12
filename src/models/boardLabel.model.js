import Joi from 'joi'
import { LABEL_COLOR, LABEL_STATUS } from '~/constant/enum/boardLable.enum'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const BOARD_LABEL_COLLECTION_NAME = 'boardLabels'

const BOARD_LABEL_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),

  title: Joi.string().required().min(3).max(50).trim().strict(),

  color: Joi.string()
    .valid(...LABEL_COLOR)
    .default('default'),

  status: Joi.string()
    .valid(...LABEL_STATUS)
    .default('active'),

  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().allow(null).default(null)
})

export const boardLabelModel = {
  BOARD_LABEL_COLLECTION_NAME,
  BOARD_LABEL_COLLECTION_SCHEMA
}
