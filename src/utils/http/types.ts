import type { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * @description 对于 axios 配置的扩展
 */
export interface AxiosOptions extends AxiosRequestConfig {
  /**
   * default extra options
   */

  /** extra options */
  extraOptions?: {
    // Splicing request parameters to url
    joinParamsToUrl?: boolean
    // Format request parameter time
    formatDate?: boolean
    // Whether to process the request result
    isTransformResponse?: boolean
    // Whether to return native response headers
    // For example: use this attribute when you need to get the response headers
    isReturnNativeResponse?: boolean
    // Whether to join url
    joinPrefix?: boolean
    // Interface address, use the default apiUrl if you leave it blank
    apiUrl?: string
    // 请求拼接路径
    urlPrefix?: string
    // // Error message prompt type
    // errorMessageMode?: 'none' | 'modal' | 'message' | undefined
    // Whether to add a timestamp
    joinTime?: boolean
    ignoreCancelToken?: boolean
    // Whether to send token in header
    withToken?: boolean
  }
  /** extra transformers */
  extraTransformers?: {
    /**
     * @description 请求发出前处理请求配置
     */
    beforeRequest?: (
      config: AxiosRequestConfig,
      options: AxiosOptions['extraOptions'],
    ) => AxiosRequestConfig | Promise<AxiosRequestConfig>

    /**
     * @description 请求结束处理数据
     */
    afterRequest?: (
      result: AxiosResponse<AxiosResult>,
      options: AxiosOptions['extraOptions'],
    ) => any

    /**
     * @description 请求失败处理
     */
    requestCatch?: (
      e: Error,
      options: AxiosOptions['extraOptions'],
    ) => Promise<any>

    /**
     * @description 请求之前的拦截器
     * see: axios type AxiosInterceptorManager<InternalAxiosRequestConfig>.use onFulfilled
     */
    requestInterceptors?: (
      config: AxiosRequestConfig,
      options: AxiosOptions,
    ) => AxiosRequestConfig | Promise<AxiosRequestConfig>

    /**
     * @description 请求之前的拦截器错误处理
     * see: axios type AxiosInterceptorManager<InternalAxiosRequestConfig>.use onRejected
     */
    requestInterceptorsCatch?: (error: any) => any

    /**
     * @description 请求之后的拦截器
     */
    responseInterceptors?: (
      result: AxiosResponse<any>,
    ) => AxiosResponse<any> | Promise<AxiosResponse<any>>

    /**
     * @description 请求之后的拦截器错误处理
     */
    responseInterceptorsCatch?: (error: any) => any
  }
  /** extra token mode */
  extraAuthenticationMode?: string

  /**
   * You can expand this type below
   */
}

/**
 * @description 对于 axios 结果的扩展
 */
export interface AxiosResult<T = any> {
  /**
   * default extra options
   */

  code: number | string
  type?: 'success' | 'error' | 'warning'
  message?: string
  result?: T

  /**
   * You can expand this type below
   */
  data?: T
  msg: string
  success: boolean
}

/** custom axios upload file config */
// multipart/form-data: upload file
export interface AxiosUploadFileOptions extends Record<string, any> {
  // Other parameters
  data?: Record<string, any>
  // File parameter interface field name
  name?: string
  // file name
  file: File | Blob
  // file name
  filename?: string
}
