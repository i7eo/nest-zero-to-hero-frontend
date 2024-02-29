import type { Role } from './model'
import { $http, type AxiosResult as IResult } from '@/utils/http'

export enum ApiPathEnum {
  roles = 'roles',
}

export function ApiRolesRead() {
  return $http.get<IResult<Role[]>>({
    url: `/${ApiPathEnum.roles}`,
  })
}
