import type { User } from './model'
import { $http, type AxiosResult as IResult } from '@/utils/http'

export enum ApiPathEnum {
  users = 'users',
}

export function ApiUsersRead() {
  return $http.get<IResult<User[]>>({
    url: `/${ApiPathEnum.users}`,
  })
}
