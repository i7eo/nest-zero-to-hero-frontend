import type { Profile } from '../profile/model'

export enum GenderEnum {
  female = '0',
  male = '1',
}
export type GenderEnumLabel = keyof typeof GenderEnum
export declare const GenderEnumLabels: ('female' | 'male')[]
export type GenderEnumValue = `${GenderEnum}`
export declare const GenderEnumValues: ('0' | '1')[]
export interface Gender {
  id: string
  label: GenderEnumLabel
  value: GenderEnumValue
  createdAt: Date
  updatedAt: Date
  profile: Profile
}
