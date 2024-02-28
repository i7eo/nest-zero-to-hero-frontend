import { merge } from 'lodash-es'
import { $Axios } from './axios'
import { ContentTypeEnum, TimeoutEnum } from './const'
import { AxiosTransformers } from './axios-transformer'
import type { AxiosOptions } from './types'

function createAxios(opt?: Partial<AxiosOptions>) {
  const extraTransformers = AxiosTransformers().transform

  return new $Axios(
    merge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // extraAuthenticationMode: 'Bearer',
        extraAuthenticationMode: '',

        timeout: TimeoutEnum.DEFAULT,

        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },

        // 数据处理方式
        extraTransformers,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        extraOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: '/api/v1',
          // 接口拼接地址
          urlPrefix: '',
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
      },
      opt || {},
    ),
  )
}

export const $http = createAxios()
export * from './types'
