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
