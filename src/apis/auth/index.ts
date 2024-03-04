import type { ISignin } from './model'
import { $http, type AxiosResult as IResult } from '@/utils/http'

enum ApiPathEnum {
  signin = 'auth/signin',
  signup = 'auth/signup',
}

export function ApiSignin(options: ISignin) {
  return $http.post<
    IResult<{
      access_token: string
    }>
  >({
    url: `/${ApiPathEnum.signin}`,
    data: options,
  })
}
