import type { ISignin } from './model'
import { $http } from '@/utils/http'

enum ApiEnum {
  SIGNIN = 'auth/signin',
  SIGNUP = 'auth/signup',
}

export function API__SIGNIN(options: ISignin) {
  return $http.post({
    url: `/${ApiEnum.SIGNIN}`,
    data: options,
  })
}
