import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import ApiError from '~/utils/ApiError'
import { env } from '~/config/environment'
import UserService from '~/services/user.service'

class UserController {
  static createNew = async (req, res, next) => {
    try {
      const createdUser = await UserService.createNew(req.body)
      res.status(StatusCodes.CREATED).json(createdUser)
    } catch (error) {
      next(error)
    }
  }

  static verifyAccount = async (req, res, next) => {
    try {
      const result = await UserService.verifyAccount(req.body)
      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  static login = async (req, res, next) => {
    try {
      const result = await UserService.login(req.body)
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: true,
        sampleSite: 'none',
        maxAge: ms(env.REFRESH_TOKEN_LIFE)
      })

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sampleSite: 'none',
        maxAge: ms(env.REFRESH_TOKEN_LIFE)
      })

      res.status(StatusCodes.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  static logout = async (req, res, next) => {
    try {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.status(StatusCodes.OK).json({ loggedOut: true })
    } catch (error) {
      next(error)
    }
  }

  static refreshToken = async (req, res, next) => {
    try {
      const result = await UserService.refreshToken(req?.cookies?.refreshToken)
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: true,
        sampleSite: 'none',
        maxAge: env.REFRESH_TOKEN_LIFE
      })
      res.status(StatusCodes.OK).json({ result })
    } catch (error) {
      next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In Again!'))
    }
  }

  static update = async (req, res, next) => {
    try {
      const userId = req.jwtDecoded._id
      const userAvatarFile = req.file

      const updatedUser = await UserService.update(
        userId,
        req.body,
        userAvatarFile
      )
      res.status(StatusCodes.OK).json(updatedUser)
    } catch (error) {
      next(error)
    }
  }
}
export default UserController
