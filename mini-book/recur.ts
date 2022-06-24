// 模式匹配可以将符合要求的内容提取出来
// 类型变化可以将内容进行变化
// 但是如果在 元素个数、字符串长度、对象层数 不确定的时候，需要用递归循环来处理
// Promise
type DeepPromiseValue<P extends Promise<unknown>> = P extends Promise<
  infer TypeValue
>
  ? TypeValue extends Promise<unknown>
    ? DeepPromiseValue<TypeValue>
    : TypeValue
  : never
type DeepPromiseRes = DeepPromiseValue<
  Promise<Promise<Promise<Record<string, any>>>>
>
// 写法需要根据场景来设定，这样即不限定泛型类型
type DeepPromiseValue2<T> = T extends Promise<infer TypeValue>
  ? DeepPromiseValue2<TypeValue>
  : T
type DeepPromiseRes2 = DeepPromiseValue2<
  Promise<Promise<Promise<Record<string, any>>>>
>
type DeepPromiseRes21 = DeepPromiseValue2<string>

// Array
// ReverseArr
// [1,2,3,4,5] -> [5,4,3,2,1]
type ReverseArr<Arr extends unknown[]> = Arr extends [
  infer First,
  ...infer Rest
]
  ? [...ReverseArr<Rest>, First]
  : Arr
type ReverseArrRes = ReverseArr<[1, 2, 3, 4, 5]>
// Includes
// [1,2,3,4,5] includes 4 -> true : false
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false) // true | never 且 deep
type Includes<Arr extends unknown[], Item> = Arr extends [
  infer First,
  ...infer Rest
]
  ? IsEqual<First, Item> extends true
    ? true
    : Includes<Rest, Item>
  : false
type IncludesRes = Includes<[1, 2, 3, 4, 5], 2>
type IncludesRes1 = Includes<[1, 2, 3, 4, 5], 0>
type IsEqualRes = IsEqual<{ a: 1; b: { c: 2 } }, { a: 1; b: { c: 2 } }>
// RemoveItem
// 泛型可以作为结果返回
type RemoveItem<
  Arr extends unknown[],
  Item,
  Res extends unknown[] = []
> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, Item> extends true
    ? RemoveItem<Rest, Item, Res>
    : RemoveItem<Rest, Item, [...Res, First]>
  : Res
type RemoveItemRes = RemoveItem<[2, 1, 2, 2, 3, 2, 5], 2>
// BuildArray
type BuildArray<
  len extends number,
  EleType = unknown,
  Arr extends unknown[] = []
> = Arr['length'] extends len
  ? Arr
  : BuildArray<len, EleType, [...Arr, EleType]>
type BuildArrayRes = BuildArray<3, number>

// String
// ReplaceAll
type ReplaceStrRes1 = ReplaceStr<'? ?', '?', 'JS'>
type ReplaceAll<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${ReplaceAll<Suffix, From, To>}`
  : Str
type ReplaceAllRes = ReplaceAll<'?? ??', '??', 'JS'>
// StringToUnion
// type -> 't' | 'y' | 'p' | 'e'
type StringToUnion<Str extends string> =
  Str extends `${infer FirstCase}${infer Rest}`
    ? FirstCase | StringToUnion<Rest>
    : never // 此处使用 Str -> ''| 't' | 'y' | 'p' | 'e'
type StringToUnionRes = StringToUnion<'type'>
// ReverseStr
type ReverseStr<
  Str extends string,
  Res extends string = ''
> = Str extends `${infer FirstCase}${infer Rest}`
  ? ReverseStr<Rest, `${FirstCase}${Res}`>
  : Res
type ReverseStrRes = ReverseStr<'typescript'>

// type ReverseStrRes = ReverseStr<'string'>
// Object
// DeepReadonly
type DeepReadonly<Obj extends Record<string, any>> = Obj extends any // 触发计算
  ? {
      readonly [K in keyof Obj]: Obj[K] extends object
        ? Obj[K] extends Function
          ? Obj[K]
          : DeepReadonly<Obj[K]>
        : Obj[K]
    }
  : never
type Obj = {
  a: {
    b: {
      c: {
        f: () => 'dong'
        d: {
          e: {
            g: string
          }
        }
      }
    }
  }
}
// ts 只有类型被用到的时候才会做类型计算
type objReadonly = DeepReadonly<Obj>
type objReadonlyA = DeepReadonly<Obj['a']>
