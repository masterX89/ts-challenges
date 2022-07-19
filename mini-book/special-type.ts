// TODO: 如何判断一个值是否是一个 class interface type

// 'isAny' 和 'isAnyRes' 可以替换，但是不能相同
type isAny<T> = 'isAny' extends 'isAnyRes' & T ? true : false
type isAnyRes = isAny<any>
type isAnyRes1 = isAny<'isAny'>
type isAnyRes2 = isAny<'isAnyRes'>

// isEqual
type isEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)
type isEqualAnyARes = isEqual<any, 'A'> // will judge whether is any
// TODO: find principle
type IsEqualEnhance<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? true
  : false

// isUnion
// A extends A 触发分布式
// [B] 会作为一个 Union 的整体 而此时 [A] 是分布式
type isUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never
type isUnionRes1 = isUnion<1>
type isUnionRes2 = isUnion<1 | 2>

// isNever
type isNever<T> = [T] extends [never] ? true : false
// type isNever<T> = T extends never ? true : false // never
type isNeverRes1 = isNever<never>
type isNeverRes2 = isNever<1>
