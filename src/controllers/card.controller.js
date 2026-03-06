import {
  CreatedSuccessResponse,
  OkSuccessResponse
} from '~/core/success.response'
import CardService from '~/services/card.service'

class CardController {
  static createNew = async (req, res) => {
    new CreatedSuccessResponse({
      message: 'Card created successfully',
      metadata: await CardService.createNew({ data: req.body })
    }).send(res)
  }

  static update = async (req, res) => {
    new OkSuccessResponse({
      message: 'Card updated successfully',
      metadata: await CardService.update({
        _id: req.params._id,
        userContext: req.userContext,
        data: req.body,
        cardCoverFile: req.file
      })
    }).send(res)
  }
}

export default CardController
