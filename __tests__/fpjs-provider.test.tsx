import { useContext } from 'react'
import { renderHook } from '@testing-library/react'
import { FpContext } from '../src'
import { createWrapper, getDefaultLoadOptions } from './helpers'
import { version } from '../package.json'
import { describe, it, expect, vi } from 'vitest'
import * as agent from '@fingerprint/agent'

vi.mock('@fingerprint/agent', { spy: true })

const mockStart = vi.mocked(agent.start)

describe('FpProvider', () => {
  it('should configure an instance of the Fp Agent', async () => {
    const loadOptions = getDefaultLoadOptions()
    const wrapper = createWrapper({
      cache: {
        cachePrefix: 'cache',
        storage: 'sessionStorage',
        duration: 100,
      },
    })
    renderHook(() => useContext(FpContext), {
      wrapper,
    })
    expect(mockStart).toHaveBeenCalledWith({
      ...loadOptions,
      integrationInfo: [`react-sdk/${version}/react`],
      cache: {
        cachePrefix: 'cache',
        storage: 'sessionStorage',
        duration: 100,
      },
    })
  })
})
