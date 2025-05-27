import multer from 'multer'
import { ALLOW_COMMON_FILE_TYPES } from '~/utils/validators'
import { LIMIT_COMMON_FILE_SIZE } from '~/utils/validators'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const customFileFilter = (req, file, callBack) => {
  //   console.log('Multer file : ', file)

  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return callBack(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    )
  }

  return callBack(null, true)
}

// khởi tạo function upload bởi multer
const upload = multer({
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE
  },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }
