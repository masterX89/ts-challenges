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

// 但是也可以简化，由于 Arr 已经是数组了，所以只需要判断空数组，其实上述的 never 不可达
type GetPopArrType2<Arr extends unknown[]> = Arr extends [
  ...infer Rest,
  unknown
]
  ? Rest
  : []
type GetPopArr2 = GetPopArrType2<[number, number, string]>
type GetPopArr21 = GetPopArrType2<[]>
type GetPopArr22 = GetPopArrType2<[string]>

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

// function
// GetParameters 提取函数参数
type GetParameters<Func extends Function> = Func extends (
  ...args: infer Args
) => unknown
  ? Args
  : never
type GetParametersRes = GetParameters<(name: string, age: number) => string>
// GetReturnType 提取函数返回值类型
type GetReturnType<Func extends Function> = Func extends (
  // 这里必须使用 any 而不能使用 unknown 否则会 返回 never
  // 因为此处参数类型需要赋值给别的类型 而 unknown 只能接收类型
  ...args: any[]
) => infer ReturnType
  ? ReturnType
  : never
type GetReturnTypeRes = GetReturnType<(name: string, age: number) => string>
// GetThisParameterType
// TODO: 需要结合你不知道的 JS 一起里的 this 理解
// 场景
class Person {
  name: string

  constructor() {
    this.name = 'Jack'
  }

  // hello() {
  hello(this: Person) {
    console.log(`hello, I'm ${this.name}`)
  }
}
const jack = new Person()
jack.hello()
// hello, I'm undefined
// jack.hello.call({ age: 25 })
// Duck Test 存在 name 和 hello 即可
jack.hello.call({ name: 'Rose', hello: () => {} })

type GetThisParameterType<T> = T extends (
  this: infer ThisType,
  ...args: any[]
) => any
  ? ThisType
  : unknown

type GetThisParameterTypeRes = GetThisParameterType<typeof jack.hello>

// TODO: ...args: any[] 和 ...args: any 区别

// 构造器
// GetConstructorParameters
type GetConstructorParameters<
  ConstructorType extends new (...args: any) => any
> = ConstructorType extends new (...args: infer ParametersType) => any
  ? ParametersType
  : never
// GetInstanceType
type GetInstanceType<ConstructorType extends new (...args: any) => any> =
  ConstructorType extends new (...args: any) => infer InstanceType
    ? InstanceType
    : any

interface Animal {
  name: string
  age: number
}
interface AnimalConstructor {
  new (name: string, age: number): Animal
}
type GetConstructorParametersRes = GetConstructorParameters<AnimalConstructor>
type GetInstanceTypeRes = GetInstanceType<AnimalConstructor>

// TODO: Top Bottom Type
// https://medium.com/@KevinBGreene/a-little-theory-with-your-typescript-top-and-bottom-types-61b380f227d

// 索引类型
// GetRefProps
type GetRefProps<Props> = 'ref' extends keyof Props
  ? Props extends { ref?: infer Value | undefined } // 这里的 undefined 测试下来更偏向显式指明 undefined
    ? Value
    : never
  : never
type GetRefPRopsRes = GetRefProps<{
  ref?: 1
  name: 'dong'
}>
type GetRefPRopsRes1 = GetRefProps<{
  ref?: null
  name: 'dong'
}>
type GetRefPRopsRes2 = GetRefProps<{
  name: 'dong'
}>
