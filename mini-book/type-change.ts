// TODO: & extends 都可以用来约束 类型，区别在哪里

// Array
// Array vs. Tuple 数组是一组 同类型 元素，而 元组 元素数量固定，可以类型不同

// Push
type Push<Arr extends unknown[], T> = [...Arr, T]
type PushRes = Push<[1, 2, 3], 4> // [1,2,3] -> [1,2,3,4]
// Unshift
type Unshift<Arr extends unknown[], T> = [T, ...Arr]
type UnshiftRes = Unshift<[1, 2, 3], 4> // [1,2,3] -> [4,1,2,3]
// Zip
// 将 [1, 2], ["TS", "JS"] -> [[1,'TS'],[2,'JS']]
type Zip<One extends unknown[], Others extends unknown[]> = One extends [
  infer OneFirst,
  infer OneSecond
]
  ? Others extends [infer OtherFirst, infer OtherSecond]
    ? [[OneFirst, OtherFirst], [OneSecond, OtherSecond]]
    : []
  : []
type ZipRes = Zip<[1, 2], ['TS', 'JS']>
// 将 [1,2, 3, 4, 5],['TS','is', 'better', 'than','JS'] -> [[1,'TS'] [2,'is'] [3, 'better'] [4,'than'] [5, 'JS']]
type ZipMore<One extends unknown[], Others extends unknown[]> = One extends [
  infer OneFirst,
  ...infer OneRest
]
  ? Others extends [infer OtherFirst, ...infer OtherRest]
    ? [[OneFirst, OtherFirst], ...ZipMore<OneRest, OtherRest>]
    : []
  : []
type ZipMoreRes = ZipMore<[1, 2, 3, 4, 5], ['TS', 'is', 'better', 'than', 'JS']>
// string
// CapitalizeStr
type CapitalizeStr<Str extends string> =
  Str extends `${infer FirstCase}${infer Rest}`
    ? `${Uppercase<FirstCase>}${Rest}`
    : Str
type CapitalizeStrRes = CapitalizeStr<'string'> // String
type CapitalizeStrRes1 = CapitalizeStr<string> // string
// CamelCase
// dong_dong_dong -> dongDongDong
type CamelCaseStr<Str extends string> =
  Str extends `${infer Left}_${infer Case}${infer Rest}`
    ? `${Left}${Uppercase<Case>}${CamelCaseStr<Rest>}`
    : Str
type CamelCaseStrRes = CamelCaseStr<'dong_dong_dong'>
// DropSubStr
type DropSubStr<
  Str extends string,
  SubStr extends string
> = Str extends `${infer prefix}${SubStr}${infer suffix}`
  ? DropSubStr<`${prefix}${suffix}`, SubStr>
  : Str
type DropSubStrRes = DropSubStr<'~~Ts is~~ better th~an JS~~', '~'>
// Function

// AppendArgument
type AppendArgument<F extends Function, Arg> = F extends (
  ...args: infer Args
) => infer returnType
  ? (...args: [...Args, Arg]) => returnType
  : never
type AppendArgumentRes = AppendArgument<
  (x: number, y: string) => number,
  boolean
>
// Index Type

// Mapping
type Mapping<T extends object> = {
  [K in keyof T as `${K & (string | number)}${K & (string | number)}`]: [
    T[K],
    T[K],
    T[K]
  ]
}
type MappingRes = Mapping<{
  a: 1
  b: 2
  1: 3
}>
// UppercaseKey 使用 as
type UppercaseKey<Obj extends object> = {
  [Key in keyof Obj as Uppercase<Key & string>]: [Obj[Key], Obj[Key], Obj[Key]]
}
type UppercaseKeyRes = UppercaseKey<{
  aaaa: 1
  bbbb: 2
}>
// 拓展 只把首字母大写
type CapitalizeStrInIndex<Str extends string> =
  Str extends `${infer FirstCase}${infer Rest}`
    ? `${Uppercase<FirstCase>}${Rest}`
    : Str
type UppercaseKeyIndex<T extends object> = {
  [K in keyof T as CapitalizeStrInIndex<K & string>]: [T[K], T[K], T[K]]
}
type UppercaseKeyIndexRes = UppercaseKeyIndex<{
  aaaa: 1
  bbbb: 2
}>
// Record
// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
// 使用 Record 可以约束 Key 的类型
type UppercaseKeyRecord<Obj extends Record<string | symbol, any>> = {
  [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}
const sym = Symbol('sym')
// type UppercaseKeyRecordRes = { AAAA: 1; BBBB: 2 }
type UppercaseKeyRecordRes = UppercaseKeyRecord<{
  aaaa: 1
  bbbb: 2
  [sym]: 3
}>
// TODO: 以下的映射都是全部映射，在实战部分需要解决只对几个属性修改
// ToReadonly
type ToReadonly<T> = {
  readonly [Key in keyof T]: T[Key]
}
type ReadOnlyRes = ToReadonly<{ name: string; age: number }>
// ToPartial
type ToPartial<T> = {
  [Key in keyof T]?: T[Key]
}
type PartialRes = ToPartial<{ name: string; age: number }>
// ToMutable
type ToMutable<T> = {
  -readonly [Key in keyof T]: T[Key]
}
type MutableRes = ToMutable<{ readonly name: string; age: number }>
// ToRequired
type ToRequired<T> = {
  [Key in keyof T]-?: T[Key]
}
type RequiredRes = ToRequired<{ name?: string; age?: number }>
// FilterByValueType
type FilterByValueType<Obj extends Record<string, any>, ValueType> = {
  [Key in keyof Obj as ValueType extends Obj[Key] ? Key : never]: Obj[Key]
}

interface Person {
  name: string
  age: number
  hobby: string[]
}
type FilterByValueTypeRes = FilterByValueType<Person, string | number>
