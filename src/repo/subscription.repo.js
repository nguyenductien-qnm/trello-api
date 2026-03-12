import { GET_DB } from '~/config/mongodb'
import { subscriptionModel } from '~/models/subscription.model'

class SubscriptionRepo {
  static createOne = async ({ data, session }) => {
    const validData = await subscriptionModel.validateBeforeCreate(data)

    return await GET_DB()
      .collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
      .insertOne(validData, { session })
  }
}
export default SubscriptionRepo
