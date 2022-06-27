type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [Key in K]: T[Key]
} & {
  [Key in keyof T as Key extends K ? never : Key]: T[Key]
}

type Test = MyReadonly2<
  {
    title: string
    description?: string
    completed: boolean
  },
  'title' | 'description'
>

type Test2 = { a: 1 } & { b: 2 }
const t: Test2 = {
  a: 1,
  b: 2,
}
