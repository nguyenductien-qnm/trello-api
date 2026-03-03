import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

class CardService {
  static createNew = async (reqBody) => {
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) await columnModel.pushCardOrderIds(getNewCard)

    return getNewCard
  }

  static update = async (cardId, reqBody, cardCoverFile, userInfo) => {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    let updatedCard = {}

    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(
        cardCoverFile.buffer,
        'card-cover'
      )
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    } else if (updateData.commentToAdd) {
      const commentData = {
        ...updateData.commentToAdd,
        userId: userInfo._id,
        userEmail: userInfo.email,
        commentedAt: Date.now()
      }
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    } else if (updateData.incomingMemberInfo) {
      updatedCard = await cardModel.updateMembers(
        cardId,
        updateData.incomingMemberInfo
      )
    } else {
      updatedCard = await cardModel.update(cardId, updateData)
    }

    return updatedCard
  }
}

export default CardService
