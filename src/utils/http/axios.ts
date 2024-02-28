import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type RawAxiosRequestHeaders,
} from 'axios'
import { cloneDeep } from 'lodash-es'
import { AxiosCanceler } from './axios-canceler'
import { isFunction } from './helper'
import { ContentTypeEnum, RequestEnum } from './const'
import type { AxiosOptions, AxiosResult, AxiosUploadFileOptions } from './types'

export class $Axios {
  private axiosInstance: AxiosInstance
  private readonly options: AxiosOptions

  constructor(options: AxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  private createAxios(config: AxiosOptions): void {
    this.axiosInstance = axios.create(config)
  }

  private getExtraTransformers() {
    const { extraTransformers } = this.options
    return extraTransformers
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  configAxios(config: AxiosOptions) {
    if (!this.axiosInstance) {
      return
    }
    this.createAxios(config)
  }

  setHeader(headers: RawAxiosRequestHeaders & Record<string, any>): void {
    if (!this.axiosInstance) {
      return
    }
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  private setupInterceptors() {
    const extraTransformers = this.getExtraTransformers()
    if (!extraTransformers) {
      return
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = extraTransformers

    const axiosCanceler = new AxiosCanceler()

    // Request interceptor configuration processing
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // If cancel repeat request is turned on, then cancel repeat request is prohibited
        const {
          // @ts-ignore
          headers: { ignoreCancelToken },
        } = config

        const ignoreCancel =
          ignoreCancelToken !== undefined
            ? ignoreCancelToken
            : this.options.extraOptions?.ignoreCancelToken

        !ignoreCancel && axiosCanceler.addPending(config)
        if (requestInterceptors && isFunction(requestInterceptors)) {
          config = (await requestInterceptors(
            config,
            this.options,
          )) as InternalAxiosRequestConfig
        }
        return config
      },
      null,
    )

    // Request interceptor error capture
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(
        null,
        requestInterceptorsCatch,
      )

    // Response result interceptor processing
    this.axiosInstance.interceptors.response.use(
      async (res: AxiosResponse<any>) => {
        res && axiosCanceler.removePending(res.config)
        if (responseInterceptors && isFunction(responseInterceptors)) {
          res = await responseInterceptors(res)
        }
        return res
      },
      null,
    )

    // Response result interceptor error capture
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(
        null,
        responseInterceptorsCatch,
      )
  }

  uploadFile<T = any>(
    config: AxiosRequestConfig,
    options: AxiosUploadFileOptions,
  ) {
    const formData = new window.FormData()
    const customFilename = options.name || 'file'

    if (options.filename) {
      formData.append(customFilename, options.file, options.filename)
    } else {
      formData.append(customFilename, options.file)
    }

    if (options.data) {
      Object.keys(options.data).forEach((key) => {
        const value = options.data![key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, options.data![key])
      })
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        // @ts-ignore
        ignoreCancelToken: true,
      },
    })
  }

  /**
   * @description support form data
   * @param config
   * @returns
   */
  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config
    } else {
      // delete dep "qs", use below code to do: qs.stringify(config.data, { arrayFormat: 'brackets' })
      let data = ''
      Object.keys(config.data).forEach((key) => {
        const value = config.data![key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            const temp = `${key}[]=${item}`
            data += data && !data.endsWith('&') ? `${temp}&` : temp
          })
          return
        }

        const temp = `${key}=${config.data![key]}`
        data += data && !data.endsWith('&') ? `${temp}&` : temp
      })

      return {
        ...config,
        data,
      }
    }
  }

  get<T = any>(
    config: AxiosRequestConfig,
    options?: AxiosOptions['extraOptions'],
  ): Promise<T> {
    return this.request({ ...config, method: RequestEnum.GET }, options)
  }

  post<T = any>(
    config: AxiosRequestConfig,
    options?: AxiosOptions['extraOptions'],
  ): Promise<T> {
    return this.request({ ...config, method: RequestEnum.POST }, options)
  }

  put<T = any>(
    config: AxiosRequestConfig,
    options?: AxiosOptions['extraOptions'],
  ): Promise<T> {
    return this.request({ ...config, method: RequestEnum.PUT }, options)
  }

  delete<T = any>(
    config: AxiosRequestConfig,
    options?: AxiosOptions['extraOptions'],
  ): Promise<T> {
    return this.request({ ...config, method: RequestEnum.DELETE }, options)
  }

  patch<T = any>(
    config: AxiosRequestConfig,
    options?: AxiosOptions['extraOptions'],
  ): Promise<T> {
    return this.request({ ...config, method: RequestEnum.PATCH }, options)
  }

  async request<T = any>(
    config: AxiosRequestConfig,
    options?: AxiosOptions['extraOptions'],
  ): Promise<T> {
    let conf: AxiosOptions = cloneDeep(config)
    const extraTransformers = this.getExtraTransformers()

    const { extraOptions } = this.options

    const opt: AxiosOptions['extraOptions'] = Object.assign(
      {},
      extraOptions,
      options,
    )

    const { beforeRequest, afterRequest, requestCatch } =
      extraTransformers || {}
    if (beforeRequest && isFunction(beforeRequest)) {
      conf = await beforeRequest(conf, opt)
    }
    conf.extraOptions = opt

    conf = this.supportFormData(conf)

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<AxiosResult>>(conf)
        .then((res: AxiosResponse<AxiosResult>) => {
          if (afterRequest && isFunction(afterRequest)) {
            try {
              const ret = afterRequest(res, opt)
              resolve(ret)
            } catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatch && isFunction(requestCatch)) {
            reject(requestCatch(e, opt))
            return
          }
          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }
          reject(e)
        })
    })
  }
}
