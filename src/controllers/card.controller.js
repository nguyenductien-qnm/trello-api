import { StatusCodes } from 'http-status-codes'
import CardService from '~/services/card.service'

class CardController {
  static createNew = async (req, res, next) => {
    try {
      const createdCard = await CardService.createNew(req.body)
      res.status(StatusCodes.CREATED).json(createdCard)
    } catch (error) {
      next(error)
    }
  }

  static update = async (req, res, next) => {
    try {
      const cardId = req.params.id
      const cardCoverFile = req.file
      const userInfo = req.jwtDecoded
      const updatedCard = await CardService.update(
        cardId,
        req.body,
        cardCoverFile,
        userInfo
      )

      res.status(StatusCodes.OK).json(updatedCard)
    } catch (error) {
      next(error)
    }
  }
}

export default CardController
