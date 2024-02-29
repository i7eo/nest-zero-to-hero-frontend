import type { User } from '../user/model'
export interface Log {
  id: string
  path: string
  method: string
  createdAt: Date
  updatedAt: Date
  result: number
  user: User
}
