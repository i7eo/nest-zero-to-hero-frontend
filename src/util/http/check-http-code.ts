// import { SessionTimeoutProcessingEnum } from '/@/enums/appEnum'
// import projectSetting from '/@/settings/projectSetting'
// import { useUserStoreWithOut } from '/@/subtree/store/user'
// const stp = projectSetting.sessionTimeoutProcessing

import { HTTP_CUSTOM_CODE_MAP, HTTP_ERROR_DEFAULT_MESSAGE } from './const'

export interface CheckHttpCodeOptions {
  /** http statu code */
  code: number
  /** default message */
  message?: string
  /** biz http statu code adapter */
  customCodeMap?: Map<number, string>
  /** if errormessage is not empty invoke this callback */
  errorMessageHandler?: (errorMessage: string) => any
}

// export interface CheckHttpCodeReturn {}
export type CheckHttpCodeReturn = void

export function checkHttpCode(
  options: CheckHttpCodeOptions,
): CheckHttpCodeReturn {
  const {
    code,
    message = '',
    customCodeMap = HTTP_CUSTOM_CODE_MAP,
    errorMessageHandler,
  } = options
  // const userStore = useUserStoreWithOut()
  let errorMessage = ''

  switch (code) {
    case 400:
      errorMessage = message || HTTP_ERROR_DEFAULT_MESSAGE
      break
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401 || 4001:
      // userStore.setToken(undefined)
      errorMessage =
        message ||
        '已退出，请重新登陆!' ||
        '用户没有权限（令牌、用户名、密码错误）!'
      // if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
      //   userStore.setSessionTimeout(true)
      // } else {
      //   userStore.logout(true, true)
      // }
      break
    case 403:
      errorMessage =
        message || '用户没有得到授权!' || '用户得到授权，但是访问是被禁止的。!'
      break
    // 404请求不存在
    case 404:
      errorMessage = message || '网络请求错误,未找到该资源!'
      break
    case 405:
      errorMessage = message || '网络请求错误,请求方法未允许!'
      break
    case 408:
      errorMessage = message || '网络请求超时!'
      break
    case 429:
      errorMessage = message || '请求太过频繁，请稍后重试!'
      break
    case 500:
      errorMessage = message || '服务器错误,请联系管理员!'
      break
    case 501:
      errorMessage = message || '网络未实现!'
      break
    case 502:
      errorMessage = message || '网络错误!'
      break
    case 503:
      errorMessage = message || '服务不可用，服务器暂时过载或维护!'
      break
    case 504:
      errorMessage = message || '网络超时!'
      break
    case 505:
      errorMessage = message || 'http版本不支持该请求!'
      break
    default:
      if (customCodeMap && customCodeMap.get(code)) {
        errorMessage = customCodeMap.get(code)!
      } else {
        errorMessage = HTTP_ERROR_DEFAULT_MESSAGE
      }
  }

  if (errorMessage && errorMessageHandler) {
    errorMessageHandler(errorMessage)
  }
}
