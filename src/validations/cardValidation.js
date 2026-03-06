import Joi from 'joi'
import { idSchema } from './commonValidation'

const create = Joi.object({
  boardId: idSchema,
  columnId: idSchema,
  title: Joi.string().required().min(3).max(50).trim().strict()
})

const update = Joi.object({
  title: Joi.string().min(3).max(50).trim().strict(),
  description: Joi.string().optional()
}).options({ allowUnknown: true })

export const cardValidation = {
  create,
  update
}
