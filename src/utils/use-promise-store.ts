import { GetOptions, GetResult } from '@fingerprint/agent'
import { useCallback, useRef } from 'react'

function getCacheKey(options?: GetOptions) {
  if (!options) {
    return ''
  }

  return `${options.tag}-${options.linkedId}-${options.timeout}`
}

export type UsePromiseStoreReturn = {
  /**
   *  Accepts a callback that returns a promise (`requestCallback`)
   *   and optional parameters (`options`). Ensures that the same request identified by a cache key is
   *   only executed once at a time, and returns the stored promise for the request. The promise is
   *   removed from the store once it is resolved or rejected.
   * */
  doRequest: (requestCallback: () => Promise<GetResult>, options?: GetOptions) => Promise<GetResult>
}

/**
 * Manages a store of promises to handle unique asynchronous requests, ensuring that
 * requests with the same key are not duplicated while they are still pending.
 */
export function usePromiseStore(): UsePromiseStoreReturn {
  const store = useRef(new Map<string, Promise<GetResult>>()).current

  const doRequest = useCallback(
    (requestCallback: () => Promise<GetResult>, options?: GetOptions) => {
      const cacheKey = getCacheKey(options)
      let cachedPromise = store.get(cacheKey)

      if (!cachedPromise) {
        cachedPromise = requestCallback().finally(() => {
          store.delete(cacheKey)
        })

        store.set(cacheKey, cachedPromise)
      }

      return cachedPromise
    },
    [store]
  )

  return {
    doRequest,
  }
}
