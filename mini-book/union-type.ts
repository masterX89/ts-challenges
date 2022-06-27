// TS 对联合类型的处理是分布式处理
type UppercaseA<Item extends string> = Item extends 'a' ? Uppercase<Item> : Item
type UppercaseARes = UppercaseA<'b' | 'a' | 'c'>
// CamelCaseUnion
type CamelCaseUnion<Item extends string> =
  Item extends `${infer Prefix}_${infer Case}${infer Rest}`
    ? `${Prefix}${Uppercase<Case>}${CamelCaseUnion<Rest>}`
    : Item
type CamelCaseUnionRes = CamelCaseUnion<'aa_aa' | 'bb_bb'>
// IsUnion
// 理解起来很复杂，现在死记硬背吧，直觉上以后 TS 会出一个 API 的
// 本质上是 A extends A 触发分布式 而 [B] 是一个**整体**的联合类型
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never

type IsUnionRes = IsUnion<'a' | 'b' | 'c'>
type IsUnionRes1 = IsUnion<['a' | 'b' | 'c']>

// BEM
type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[]
> = `${Block}__${Element[number]}--${Modifiers[number]}`
type bemResult = BEM<'div', ['aaa', 'bbb'], ['warning', 'success']>

type Combination<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`
type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combination<A, AllCombinations<Exclude<B, A>>>
  : never
// "A" | "B" | "C" | "AB" | "AC" | "BA" | "CA"
type CombinationRes = Combination<'A', 'B' | 'C'>
type CombinationRes1 = Combination<'A', Exclude<'A' | 'B' | 'C', 'A'>>

type AllCombinationsRes = AllCombinations<'A' | 'B' | 'C'>
