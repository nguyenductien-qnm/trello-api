import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { idSchema } from './commonValidation'

const create = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict()
})

const update = Joi.object({
  title: Joi.string().min(3).max(50).trim().strict(),
  cardOrderIds: Joi.array().items(idSchema)
}).options({ allowUnknown: true })

export const columnValidation = {
  create,
  update
}
