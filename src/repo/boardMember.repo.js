import { GET_DB } from '~/config/mongodb';
import { boardMemberModel } from '~/models/boardMember.model';

class BoardMemberRepo {
    static createOne = async ({ data, session }) => {
        const validData = await boardMemberModel.validateBeforeCreate(data)
        return await GET_DB()
            .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
            .insertOne(validData, { session })
    }
}

export default BoardMemberRepo