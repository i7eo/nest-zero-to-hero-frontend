export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === 'object'
export const isFunction = (value: unknown): value is (...args: any) => any =>
  typeof value === 'function'
export const isString = (value: unknown): value is string =>
  typeof value === 'string'
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean'
export const isNumber = (value: unknown): value is number =>
  typeof value === 'number'
export const isUndef = (value: unknown): value is undefined =>
  typeof value === 'undefined'
export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)
export const isAppleDevice = /(mac|iphone|ipod|ipad)/i.test(
  typeof navigator !== 'undefined' ? navigator?.platform : '',
)
export const isDev =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
