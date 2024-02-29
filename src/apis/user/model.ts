import type { Log } from '../log/model'
import type { Role } from '../role/model'
import type { Profile } from '../profile/model'
export interface User {
  id: string
  username: string
  password: string
  profile: Profile
  logs: Log[]
  roles: Role[]
  createdAt: Date
  updatedAt: Date
  afterInsert(): void
  afterRemove(): void
}
