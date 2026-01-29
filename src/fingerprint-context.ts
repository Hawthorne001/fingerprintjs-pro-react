import { createContext } from 'react'
import { GetOptions, GetResult } from '@fingerprint/agent'
import { QueryResult } from './query'

export type VisitorQueryResult = QueryResult<GetResult>

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <FingerprintProvider>.')
}

const initialContext = {
  getVisitorData: stub,
}

/**
 * The Fingerprint Context
 */
export interface FingerprintContextInterface {
  getVisitorData: (config?: GetOptions) => Promise<GetResult>
}

export const FingerprintContext = createContext<FingerprintContextInterface>(initialContext)
