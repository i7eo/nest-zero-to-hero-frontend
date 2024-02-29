import { checkHttpCode } from './check-http-code'
import { RequestEnum } from './const'
import {
  formatRequestDate,
  isArray,
  isString,
  joinTimestamp,
  setObjToUrlParams,
} from './helper'
import type { AxiosOptions } from './types'

export function AxiosTransformers() {
  const transform: AxiosOptions['extraTransformers'] = {
    beforeRequest(config, options) {
      const {
        apiUrl,
        joinPrefix,
        joinParamsToUrl,
        formatDate,
        joinTime = true,
        urlPrefix,
      } = options!

      if (joinPrefix) {
        config.url = `${urlPrefix}${config.url}`
      }

      if (apiUrl && isString(apiUrl)) {
        config.url = `${apiUrl}${config.url}`
      }

      const params = config.params || {}
      const data = config.data || false

      formatDate && data && !isString(data) && formatRequestDate(data)

      if (config.method?.toUpperCase() === RequestEnum.GET) {
        if (!isString(params)) {
          // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
          config.params = Object.assign(
            params || {},
            joinTimestamp(joinTime, false),
          )
        } else {
          // 兼容restful风格
          config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`
          config.params = undefined
        }
      } else {
        if (!isString(params)) {
          formatDate && formatRequestDate(params)
          if (
            Reflect.has(config, 'data') &&
            config.data &&
            Object.keys(config.data).length > 0
          ) {
            config.data = data
            config.params = params
          } else {
            if (isArray(config.data)) {
              // 空数组处理
              config.data = data
              config.params = params
            } else {
              // 非GET请求如果没有提供data，则将params视为data
              config.data = params
              config.params = undefined
            }
          }
          if (joinParamsToUrl) {
            config.url = setObjToUrlParams(
              config.url as string,
              Object.assign({}, config.params, config.data),
            )
          }
        } else {
          // 兼容restful风格
          config.url = config.url + params
          config.params = undefined
        }
      }

      return config
    },
    afterRequest(result, options) {
      const { isTransformResponse, isReturnNativeResponse } = options!

      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (isReturnNativeResponse) {
        return result
      }

      // 不进行任何处理，直接返回
      // 用于页面代码可能需要直接获取code，data，message这些信息时开启
      if (!isTransformResponse) {
        return result.data
      }

      // 错误的时候返回
      const { data } = result

      if (!data) {
        // return '[HTTP] Request has no return value';
        throw new Error('请求出错，请稍候重试🤦‍♂️')
      }

      // //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
      // const { code, result, message } = data;
      // // 这里逻辑可以根据项目进行修改
      // const hasSuccess = data && Reflect.has(data, "code") && code === ResultEnum.SUCCESS;
      // if (hasSuccess) {
      //   return result;
      // }
      // // 在此处根据自己项目的实际情况对不同的code执行不同的操作
      // // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
      // let timeoutMsg = "";
      // switch (code) {
      //   case ResultEnum.TIMEOUT:
      //     timeoutMsg = "登录超时,请重新登录!";
      //     const userStore = useUserStoreWithOut();
      //     userStore.setToken(undefined);
      //     userStore.logout(true);
      //     break;
      //   default:
      //     if (message) {
      //       timeoutMsg = message;
      //     }
      // }
      // // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
      // // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
      // if (options.errorMessageMode === "modal") {
      //   createErrorModal({ title: "错误提示", content: timeoutMsg });
      // } else if (options.errorMessageMode === "message") {
      //   createMessage.error(timeoutMsg);
      // }
      // throw new Error(timeoutMsg || "请求出错，请稍候重试");

      // ::==================== i7eo：添加 ///// start ///// ====================:: //
      const {
        code,
        msg: message = '服务出了些问题，数据回家了🤦‍♂️',
        success,
      } = data

      if (data instanceof Blob) {
        return data
      }

      if (success) {
        return data
      }

      checkHttpCode({
        code: Number(code),
        message,
        errorMessageHandler(message) {
          console.log(message)
        },
      })

      throw new Error('请求出错，请稍候重试')
      // ::==================== i7eo：添加 /////  end  ///// ====================:: //
    },
    requestInterceptors(config, options) {
      // const token = getToken()
      const token = localStorage.getItem('Token')
        ? JSON.parse(localStorage.getItem('Token')!)
        : null
      if (token && (config as Record<string, any>)?.extraOptions?.withToken) {
        // jwt token
        ;(config as Record<string, any>).headers.Authorization = options!
          .extraAuthenticationMode
          ? `${options!.extraAuthenticationMode} ${token}`
          : token
      }
      return config
    },
    responseInterceptors(result) {
      return result
    },
    responseInterceptorsCatch(error) {
      // const errorLogStore = useErrorLogStoreWithOut()
      // errorLogStore.addAjaxErrorInfo(error)
      const { response, code, message, config } = error || {}
      const errorMessageMode = config?.extraOptions?.errorMessageMode || 'none'
      const msg: string = response?.data?.error?.message ?? ''
      const err: string = error?.toString?.() ?? ''
      let errMessage = ''

      try {
        if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
          errMessage = '接口请求超时,请刷新页面重试!'
        }
        if (err?.includes('Network Error')) {
          errMessage = '网络异常，请检查您的网络连接是否正常!'
        }

        if (errMessage) {
          // if (errorMessageMode === 'modal') {
          //   createErrorModal({ title: '错误提示', content: errMessage })
          // } else if (errorMessageMode === 'message') {
          //   createMessage.error(errMessage)
          // }
          return Promise.reject(error)
        }
      } catch (error) {
        throw new Error(error as unknown as string)
      }

      checkHttpCode({
        code: error?.response?.status,
        message: msg,
        errorMessageHandler(_message) {
          console.log(_message, errorMessageMode)
        },
      })
      return Promise.reject(error)
    },
  }

  return {
    transform,
  }
}
