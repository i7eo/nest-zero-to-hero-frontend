/**
 * @description request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * @description contentTyp
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

/**
 * @description timeout
 */
export enum TimeoutEnum {
  /** 请求过期时间 */
  DEFAULT = 30 * 1000,
  FILE_UPLOAD = 10 * 60 * 1000,
  FILE_DOWNLOAD = 10 * 60 * 1000,
}

/** request time format */
export const HTTP_DATA_TIME_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/** http error default msg */
export const HTTP_ERROR_DEFAULT_MESSAGE = '请求失败,系统异常!'

function createCustomCodeMap() {
  const customCodeMap = new Map()

  customCodeMap.set(5001, HTTP_ERROR_DEFAULT_MESSAGE)

  return customCodeMap
}
/** http custom code */
export const HTTP_CUSTOM_CODE_MAP = createCustomCodeMap()
