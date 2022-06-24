// Add
type Add<Num1 extends number, Num2 extends number> = [
  ...BuildArray<Num1>,
  ...BuildArray<Num2>
]['length']
type AddRes = Add<11, 23>
// Subtract
type Subtract<
  Num1 extends number,
  Num2 extends number
> = BuildArray<Num1> extends [...BuildArray<Num2>, ...infer Rest]
  ? Rest['length']
  : never
type SubtractRes = Subtract<23, 1>
// Multiply
type Multiply<
  Num1 extends number,
  Num2 extends number,
  Res extends unknown[] = []
> = Num2 extends 0
  ? Res['length']
  : Multiply<Num1, Subtract<Num2, 1>, [...Res, ...BuildArray<Num1>]>
type MultiplyRes = Multiply<4, 5>
// Divide
// TODO: 实现整除
type Divide<
  Num1 extends number,
  Num2 extends number,
  Res extends unknown[] = []
> = Num1 extends 0
  ? Res['length']
  : Divide<Subtract<Num1, Num2>, Num2, [...Res, unknown]>
type DivideRes = Divide<30, 5>
// StrLen
type StrLen<
  Str extends string,
  Res extends unknown[] = []
> = Str extends `${string}${infer Rest}`
  ? StrLen<Rest, [...Res, unknown]>
  : Res['length']
type StrLenRes = StrLen<'Hello TypeScript'>
// GreaterThan >
type GreaterThan<
  Num1 extends number,
  Num2 extends number,
  Cnt extends unknown[] = []
> = Num1 extends Num2
  ? false
  : Cnt['length'] extends Num2
  ? true
  : Cnt['length'] extends Num1
  ? true
  : GreaterThan<Num1, Num2, [...Cnt, unknown]>
type GreaterThanRes = GreaterThan<5, 4>
type GreaterThanRes1 = GreaterThan<5, 5>
type GreaterThanRes2 = GreaterThan<5, 7>
// Fibonacci
