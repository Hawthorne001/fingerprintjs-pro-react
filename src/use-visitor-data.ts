import { FpjsContextInterface, FpjsContext, GetDataOptions, QueryResult, VisitorQueryContext } from './fpjs-context'
import { useCallback, useContext, useEffect, useState } from 'react'
import { VisitorData, FingerprintJSPro } from '@fingerprintjs/fingerprintjs-pro-spa'
import deepEquals from 'fast-deep-equal'
import { toError } from './utils/to-error'
import { assertIsTruthy } from './utils/assert-is-truthy'

export type UseVisitorDataOptions<TExtended extends boolean> = GetDataOptions<TExtended>

/**
 *  @example
 * ```js
 *  const {
 *    // Request state
 *    data,
 *    isLoading,
 *    error,
 *    // A method to be called manually when the `immediate` field in the config is set to `false`:
 *    getData,
 *  } = useVisitorData({ extended: true }, { immediate: false });
 * ```
 * Use the `useVisitorData` hook in your components to perform identification requests with the FingerprintJS API. The returned object contains information about loading status, errors, and visitor.
 *
 * @param getOptions options for the `fp.get()` request
 * @param config config for the hook
 */
export function useVisitorData<TExtended extends boolean>(
  getOptions: UseVisitorDataOptions<TExtended> = {},
  config: UseVisitorDataConfig = defaultUseVisitorDataConfig
): VisitorQueryContext<TExtended> {
  assertIsTruthy(getOptions, 'getOptions')

  const { immediate } = config
  const { getVisitorData } = useContext<FpjsContextInterface<TExtended>>(FpjsContext)

  const initialState: QueryResult<VisitorData<TExtended>> & { getOptions: UseVisitorDataOptions<TExtended> } = {
    isLoading: config.immediate,
    getOptions,
  }
  const [state, setState] = useState(initialState)

  const getData = useCallback<VisitorQueryContext<TExtended>['getData']>(
    async (params = {}) => {
      assertIsTruthy(params, 'getDataParams')

      const { ignoreCache, ...getDataPassedOptions } = params

      try {
        setState((state) => ({ ...state, isLoading: true }))

        const { ignoreCache: defaultIgnoreCache, ...getVisitorDataOptions } = state.getOptions

        const getDataOptions: FingerprintJSPro.GetOptions<TExtended> = {
          ...getVisitorDataOptions,
          ...getDataPassedOptions,
        }

        const result = await getVisitorData(
          getDataOptions,
          typeof ignoreCache === 'boolean' ? ignoreCache : defaultIgnoreCache
        )
        setState((state) => ({ ...state, data: result, isLoading: false, error: undefined }))
        return result
      } catch (unknownError) {
        const error = toError(unknownError)

        error.name = 'FPJSAgentError'

        setState((state) => ({ ...state, data: undefined, error }))

        throw error
      } finally {
        setState((state) => (state.isLoading ? { ...state, isLoading: false } : state))
      }
    },
    [state.getOptions, getVisitorData]
  )

  useEffect(() => {
    if (immediate) {
      getData().catch((error) => {
        console.error(`Failed to fetch visitor data on mount: ${error}`)
      })
    }
  }, [immediate, getData])

  if (!Object.is(state.getOptions, getOptions) && !deepEquals(state.getOptions, getOptions)) {
    setState((state) => ({ ...state, getOptions }))
  }

  const { isLoading, data, error } = state

  return {
    getData,
    isLoading,
    data,
    error,
  }
}

export interface UseVisitorDataConfig {
  /**
   * Determines whether the `getData()` method will be called immediately after the hook mounts or not
   */
  immediate: boolean
}

const defaultUseVisitorDataConfig = { immediate: true }
