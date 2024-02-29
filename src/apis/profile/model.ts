import type { Gender } from '../gender/model'
import type { User } from '../user/model'
export interface Profile {
  id: string
  gender: Gender
  avator: string
  email: string
  address: string
  user: User
  createdAt: Date
  updatedAt: Date
}
