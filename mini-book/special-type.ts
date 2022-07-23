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
type isEqualEnhanceRes1 = IsEqualEnhance<any, 'A'> // will judge whether is any
type isEqualEnhanceRes2 = IsEqualEnhance<any, any>

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

// isTuple
// Tuple 两个特征: 1. 元组 El 是 readonly 2. 元组 length 类型是数字字面量 数组 length 类型是 number
type IsTuple<T> = T extends readonly [...params: infer Els]
  ? NotEqual<Els['length'], number>
  : false
type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? false
  : true
type IsTupleRes1 = IsTuple<[1, 2, 3]>
type IsTupleRes2 = IsTuple<number[]>

// TODO: 逆变 协变
// UnionToIntersection 逆变一般只用于此处
type UnionToIntersectionStep1<U> = U extends U ? (x: U) => unknown : never
type UnionToIntersection<U> = (
  U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never
type UnionToIntersectionStep1Res = UnionToIntersectionStep1<
  { x: number } | { y: string }
>
type UnionToIntersectionRes = UnionToIntersection<{ x: number } | { y: string }>

// GetOptional
type GetOptional<Obj extends Record<string, any>> = {
  [Key in keyof Obj as {} extends Pick<Obj, Key> ? Key : never]: Obj[Key]
}
type GetOptionalRes = GetOptional<{ name: string; age?: number }>
// GetRequest
type GetRequest<Obj extends Record<string, any>> = {
  [Key in keyof Obj as {} extends Pick<Obj, Key> ? never : Key]: Obj[Key]
}
type GetRequestRes = GetRequest<{ name: string; age?: number }>

// RemoveIndexSignature
// TODO: number 怎么办
type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key]
}
type RemoveIndexSignatureRes = RemoveIndexSignature<{
  [key: string]: any
  a: number
  1: string
}>

type RemoveIndexSignatureEnhance<Obj extends Record<string | number, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}`
    ? Str
    : Key extends number
    ? Key
    : never]: Obj[Key]
}
type RemoveIndexSignatureEnhanceRes = RemoveIndexSignatureEnhance<{
  [key: string]: any
  a: number
  1: string
}>
