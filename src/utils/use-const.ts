import { useRef } from 'react'

export function useConst<T>(initialValue: T | (() => T)): T {
  const ref = useRef<T>(typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue)

  return ref.current
}
