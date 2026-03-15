import { GET_DB } from '~/config/mongodb'
import { boardMemberModel } from '~/models/boardMember.model'
import { boardRoleModel } from '~/models/boardRole.model'
import { userModel } from '~/models/user.model'
import { workspaceMemberModel } from '~/models/workspaceMember.model'

class BoardMemberRepo {
    static createOne = async ({ data, session }) => {
        const validData = await boardMemberModel.validateBeforeCreate(data)
        return await GET_DB()
            .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
            .insertOne(validData, { session })
    }

    static getMembers = async ({ filter, data, options = {} }) => {
        const { sort = { createdAt: -1 }, skip = 0, limit = 50 } = options
        const { search = '' } = data

        return await GET_DB()
            .collection(boardMemberModel.BOARD_MEMBER_COLLECTION_NAME)
            .aggregate([
                { $match: filter },

                {
                    $addFields: {
                        boardRoleObjectId: { $toObjectId: '$boardRoleId' },
                        workspaceMemberObjectId: { $toObjectId: '$workspaceMemberId' }
                    }
                },

                {
                    $lookup: {
                        from: boardRoleModel.BOARD_ROLE_COLLECTION_NAME,
                        localField: 'boardRoleObjectId',
                        foreignField: '_id',
                        as: 'role'
                    }
                },
                {
                    $unwind: {
                        path: '$role',
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: workspaceMemberModel.WORKSPACE_MEMBER_COLLECTION_NAME,
                        localField: 'workspaceMemberObjectId',
                        foreignField: '_id',
                        as: 'member'
                    }
                },
                {
                    $unwind: {
                        path: '$member',
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $addFields: {
                        userObjectId: {
                            $convert: {
                                input: '$member.userId',
                                to: 'objectId',
                                onError: null,
                                onNull: null
                            }
                        }
                    }
                },

                {
                    $lookup: {
                        from: userModel.USER_COLLECTION_NAME,
                        localField: 'userObjectId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true
                    }
                },

                ...(search
                    ? [
                        {
                            $match: {
                                $or: [
                                    { 'user.email': { $regex: search, $options: 'i' } },
                                    { 'user.displayName': { $regex: search, $options: 'i' } }
                                ]
                            }
                        }
                    ]
                    : []),

                {
                    $project: {
                        _id: 1,
                        status: 1,
                        joinAt: 1,
                        role: {
                            name: '$role.name'
                        },
                        user: {
                            displayName: '$user.displayName',
                            email: '$user.email',
                            avatar: '$user.avatar'
                        }
                    }
                },

                { $sort: sort },
                { $skip: skip },
                { $limit: limit }
            ])
            .toArray()
    }
}

export default BoardMemberRepo