import { columnModel } from '~/models/column.model'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import CardRepo from '~/repo/card.repo'

class CardService {
  static createNew = async ({ data }) => {
    const createdCard = await CardRepo.createOne({ data })

    const card = await CardRepo.findOneById({
      _id: createdCard.insertedId
    })

    if (card) await columnModel.pushCardOrderIds(card)

    return card
  }

  static update = async ({ _id, userContext, data, cardCoverFile }) => {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }

    let updatedCard = {}

    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(
        cardCoverFile.buffer,
        'card-cover'
      )
      updatedCard = await CardRepo.updateOne({
        _id,
        data: { cover: uploadResult.secure_url }
      })
    } else if (updateData.commentToAdd) {
      const commentData = {
        ...updateData.commentToAdd,
        userId: userContext._id,
        userEmail: userContext.email,
        commentedAt: Date.now()
      }
      updatedCard = await CardRepo.unshiftNewComment({ _id, data: commentData })
    } else if (updateData.incomingMemberInfo) {
      updatedCard = await CardRepo.updateMembers({
        _id,
        data: updateData.incomingMemberInfo
      })
    } else {
      updatedCard = await CardRepo.updateOne({ _id, data: updateData })
    }

    return updatedCard
  }
}

export default CardService
