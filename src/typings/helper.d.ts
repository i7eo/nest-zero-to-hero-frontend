export type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}
export type Nullable<T> = T | null
export type NonNullable<T> = T extends null | undefined ? never : T
export type Recordable<T = any> = Record<string, T>
export type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T
}
export type Indexable<T = any> = {
  [key: string]: T
}
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}
export type TimeoutReturn = ReturnType<typeof setTimeout>
export type IntervalReturn = ReturnType<typeof setInterval>
