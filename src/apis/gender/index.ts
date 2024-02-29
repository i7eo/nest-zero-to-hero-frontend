import type { Gender } from './model'
import { $http, type AxiosResult as IResult } from '@/utils/http'

export enum ApiPathEnum {
  genders = 'genders',
}

export function ApiGendersRead() {
  return $http.get<IResult<Gender[]>>({
    url: `/${ApiPathEnum.genders}`,
  })
}
