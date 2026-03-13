import Joi from 'joi'
import { visibility } from '~/constant/enum/board.enum'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { optionalIdSchema } from './commonValidation'

const create = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict().messages({
    'any.required': 'Title is required.',
    'string.empty': 'Title is not allowed to be empty.',
    'string.min': 'Title length must be at least 3 characters long.',
    'string.max':
      'Title length must be less than or equal to 5 characters long.',
    'string.trim': 'Title must not have leading or trailing whitespace.'
  }),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  visibility: Joi.string()
    .required()
    .valid(...Object.values(visibility)),
  workspaceId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
})

const update = Joi.object({
  title: Joi.string().min(3).max(50).trim().strict(),
  description: Joi.string().min(3).max(255).trim().strict(),
  visibility: Joi.string().valid(...Object.values(visibility)),
  columnOrderIds: Joi.array().items(optionalIdSchema)
})

const moveCardToDifferentColumn = Joi.object({
  currentCardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  prevColumnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  prevCardOrderIds: Joi.array().required().items(optionalIdSchema),

  nextColumnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  nextCardOrderIds: Joi.array().required().items(optionalIdSchema)
})

export const boardValidation = {
  create,
  update,
  moveCardToDifferentColumn
}
