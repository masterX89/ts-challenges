// 模板字面量
type MyString = `${string}#`
const myString: MyString = '1#'
// Type '"12"' is not assignable to type '`${string}#`'
// const myString2: MyString = '12'

// 映射类型 值和索引均可映射
type MapType<T> = {
  [K in keyof T as `${K & (string | number)}${K & (string | number)}`]: [
    T[K],
    T[K],
    T[K]
  ]
}

type MapTypeRes = MapType<{ a: number; b: string; 1: 1 }>

const map: MapTypeRes = {
  aa: [1, 2, 3],
  bb: ['1', '2', '3'],
  11: [1, 1, 1],
}
