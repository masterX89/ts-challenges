// 类型模式匹配可以用于 提取

// 匹配 Promise 中的类型
// 1. P 泛型需要判断为 Promise
// 2. 使用 infer 声明保存到 局部类型变量中
type GetPromiseValue<P> = P extends Promise<infer V> ? V : never
type PromiseValue = GetPromiseValue<Promise<string>>

// 匹配数组类型

// 1. 匹配数组中第一个元素类型

// 泛型 T 应 extends unknown[] 被约束为 数组
// T 应该至少有一个元素
type GetFirstType<Arr extends unknown[]> = Arr extends [
  infer First,
  ...unknown[]
]
  ? First
  : never

type GetFirst = GetFirstType<[number, string]>
type GetFirst1 = GetFirstType<[]>

// 这样写没有约束 Arr 为一个数组
// type GetFirstType<Arr> = Arr extends [infer First, ...unknown[]] ? First : never
// type GetFirst = GetFirstType<string>

// 2. 匹配数组中最后一个元素类型
type GetLastType<Arr extends unknown[]> = Arr extends [...unknown[], infer Last]
  ? Last
  : never

type GetLast = GetLastType<[number, string]>
type GetLast1 = GetLastType<[]>

// 3. PopArr 匹配数组中除了最后一个元素的类型
type GetPopArrType<Arr extends unknown[]> = Arr extends [] // 如果是 [] 不应该是 never 而应该是 []
  ? []
  : Arr extends [...infer Rest, unknown]
  ? Rest
  : never
type GetPopArr = GetPopArrType<[number, number, string]>
type GetPopArr1 = GetPopArrType<[]>

// 4. ShiftArr 匹配数组中除了第一个元素的类型
type GetShiftArrType<Arr extends unknown[]> = Arr extends [] // 如果是 [] 不应该是 never 而应该是 []
  ? []
  : Arr extends [unknown, ...infer Rest]
  ? Rest
  : never

type GetShiftArr = GetShiftArrType<[number, number, string]>
type GetShiftArr1 = GetShiftArrType<[]>

// 匹配字符串类型
// 1. StartsWith
type StartsWithStr<
  Str extends string,
  Prefix extends string
> = Str extends `${Prefix}${string}` ? true : false
type StartsWithStrRes = StartsWithStr<'prefix string', 'prefix'>
type StartsWithStrRes1 = StartsWithStr<'string', 'prefix'>
// 同理可以完成 endsWith
type EndsWithStr<
  Str extends string,
  Suffix extends string
> = Str extends `${string}${Suffix}` ? true : false
type EndsWithStrRes = EndsWithStr<'string suffix', 'suffix'>
type EndsWithStrRes1 = EndsWithStr<'string', 'suffix'>
// 2. Replace
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str
type ReplaceStrRes = ReplaceStr<'I will say ? is better than JS', '?', 'TS'>
// 3. Trim | TrimLeft | TrimRight
type TrimRightStr<Str extends string> = Str extends `${infer Rest}${
  | ' '
  | '\n'
  | '\t'}`
  ? TrimRightStr<Rest>
  : Str
type TrimLeftStr<Str extends string> = Str extends `${
  | ' '
  | '\n'
  | '\t'}${infer Rest}`
  ? TrimLeftStr<Rest>
  : Str
type TrimStr<Str extends string> = TrimLeftStr<TrimRightStr<Str>>
type TrimStrRes = TrimStr<'   hello     '>
