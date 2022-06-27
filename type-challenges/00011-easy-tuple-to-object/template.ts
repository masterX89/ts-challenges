type TupleToObject<T extends readonly (string | number)[]> = {
  [K in T[number]]: K
}

type TNum<T extends readonly any[]> = T[number]
// "tesla" | 1 | "aa"
type TNumberRes = TNum<['tesla', 1, 'aa']>

type TupleToObjectRes = TupleToObject<['tesla', 1, 'aa']>
