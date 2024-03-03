import useUserStore from '@/stores/user.store'
import { HTTP_DATA_TIME_DATE_FORMAT } from './const'

export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === 'object'

export const isFunction = (value: unknown): value is (...args: any) => any =>
  typeof value === 'function'

export const isString = (value: unknown): value is string =>
  typeof value === 'string'

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

/**
 * @description Add timestamp avoid cache
 * @param join
 * @param restful
 * @returns
 */
export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {}
  }
  const now = new Date().getTime()
  if (restful) {
    return `?_t=${now}`
  }
  return { _t: now }
}

/**
 * @description Format request parameter time
 * @param params
 * @returns
 */
export function formatRequestDate(params: Record<string, any>) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return
  }

  for (const key in params) {
    if (params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].format(HTTP_DATA_TIME_DATE_FORMAT)
    }
    if (isString(key)) {
      const value = params[key]
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value
        } catch (error: any) {
          throw new Error(error)
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key])
    }
  }
}

/**
 * @description Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) {
    parameters += `${key}=${encodeURIComponent(obj[key])}&`
  }
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters
}

export function getToken() {
  const token = useUserStore.getState().token ?? null
  return token
}