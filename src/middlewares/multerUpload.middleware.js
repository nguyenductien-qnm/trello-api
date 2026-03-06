import multer from 'multer'
import { ALLOW_COMMON_FILE_TYPES } from '~/utils/validators'
import { LIMIT_COMMON_FILE_SIZE } from '~/utils/validators'
import { UnprocessableEntityErrorResponse } from '~/core/error.response'

const customFileFilter = (req, file, cb) => {
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    return cb(
      new UnprocessableEntityErrorResponse(
        'File type is invalid. Only accept jpg, jpeg and png'
      ),
      false
    )
  }
  cb(null, true)
}

const upload = multer({
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE
  },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }
