import type { ISignin } from './model'
import { $http, type AxiosResult as IResult } from '@/utils/http'

enum ApiEnum {
  SIGNIN = 'auth/signin',
  SIGNUP = 'auth/signup',
}

export function API__SIGNIN(options: ISignin) {
  return $http.post<
    IResult<{
      access_token: string
    }>
  >({
    url: `/${ApiEnum.SIGNIN}`,
    data: options,
  })
}
