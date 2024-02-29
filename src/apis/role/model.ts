import type { User } from '../user/model'
export enum RoleEnum {
  owner = '0',
  maintainer = '1',
  developer = '2',
  reporter = '3',
  custom = '4',
  guest = '5',
}
export type RoleEnumLabel = keyof typeof RoleEnum
export declare const RoleEnumLabels: (
  | 'owner'
  | 'maintainer'
  | 'developer'
  | 'reporter'
  | 'custom'
  | 'guest'
)[]
export type RoleEnumValue = `${RoleEnum}`
export declare const RoleEnumValues: ('0' | '1' | '2' | '3' | '4' | '5')[]
export interface Role {
  id: string
  label: RoleEnumLabel
  value: RoleEnumValue
  createdAt: Date
  updatedAt: Date
  users: User[]
}
