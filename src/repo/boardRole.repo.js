import { boardRoleModel } from '~/models/boardRole.model';
import { GET_DB } from '~/config/mongodb';

class BoardRoleRepo {
    static createOne = async ({ data, session }) => {
        const validData = await boardRoleModel.validateBeforeCreate(data)
        return await GET_DB()
            .collection(boardRoleModel.BOARD_ROLE_COLLECTION_NAME)
            .insertOne(validData, { session })
    }
}

export default BoardRoleRepo