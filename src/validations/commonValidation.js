import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const idSchema = Joi.string()
  .pattern(OBJECT_ID_RULE)
  .message(OBJECT_ID_RULE_MESSAGE)
  .required()

const optionalIdSchema = Joi.string()
  .pattern(OBJECT_ID_RULE)
  .message(OBJECT_ID_RULE_MESSAGE)

const validateIdParamSchema = Joi.object({
  _id: idSchema
})

export { idSchema, optionalIdSchema, validateIdParamSchema }
