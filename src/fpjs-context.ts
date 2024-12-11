import { createContext } from 'react'
import { VisitorData, GetOptions, FingerprintJSPro } from '@fingerprintjs/fingerprintjs-pro-spa'

export interface QueryResult<TData, TError = Error> {
  /**
   * Stores current query data
   * */
  data?: TData
  /**
   * Is true while query is loading
   * */
  isLoading?: boolean
  /**
   * Stores current query error
   * */
  error?: TError
}

export interface VisitorQueryResult<TExtended extends boolean> extends QueryResult<VisitorData<TExtended>> {
  data?: VisitorData<TExtended>
}

export interface GetDataOptions<TExtended extends boolean> extends FingerprintJSPro.GetOptions<TExtended> {
  /**
   * When set to true, the visitor data will always be fetched from our API.
   * */
  ignoreCache?: boolean
}

export interface VisitorQueryContext<TExtended extends boolean> extends VisitorQueryResult<TExtended> {
  /**
   * Performs identification request to server and returns visitors data.
   * */
  getData: (getDataOptions?: GetDataOptions<TExtended>) => Promise<VisitorData<TExtended>>
}

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <FpjsProvider>.')
}

const initialContext = {
  getVisitorData: stub,
  clearCache: stub,
}

/**
 * The FingerprintJS Context
 */
export interface FpjsContextInterface<TExtended extends boolean> {
  getVisitorData: (config?: GetOptions<TExtended>, ignoreCache?: boolean) => Promise<VisitorData<TExtended>>
  clearCache: () => void
}

export const FpjsContext = createContext<FpjsContextInterface<any>>(initialContext)
