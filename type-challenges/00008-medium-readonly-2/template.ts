type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [Key in K]: T[Key]
} & {
  [Key in keyof T as Key extends K ? never : Key]: T[Key]
}
