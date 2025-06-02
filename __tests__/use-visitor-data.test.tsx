import { useVisitorData, VisitorQueryContext } from '../src'
import { render, renderHook } from '@testing-library/react'
import { actWait, createWrapper } from './helpers'
import { act } from 'react-dom/test-utils'
import { useEffect, useState } from 'react'
import userEvent from '@testing-library/user-event'
import { FingerprintJSPro } from '@fingerprintjs/fingerprintjs-pro-spa'

const testData = {
  visitorId: 'abcdef123456',
}
const init = jest.fn()
const getVisitorData = jest.fn()

jest.mock('@fingerprintjs/fingerprintjs-pro-spa', () => {
  return {
    ...(jest.requireActual('@fingerprintjs/fingerprintjs-pro-spa') as any),
    FpjsClient: jest.fn(() => {
      return {
        init,
        getVisitorData,
        clearCache: jest.fn(),
      }
    }),
  }
})

describe('useVisitorData', () => {
  beforeEach(() => {
    getVisitorData.mockReset()
  })

  it('should provide the Fpjs context', async () => {
    const wrapper = createWrapper()
    const {
      result: { current },
      rerender,
    } = renderHook(() => useVisitorData(), { wrapper })

    rerender()

    expect(current).toBeDefined()
  })

  it('should call getData on mount by default', async () => {
    getVisitorData.mockImplementation(() => testData)

    const wrapper = createWrapper()
    const { result } = renderHook(() => useVisitorData({}, { immediate: true }), { wrapper })
    expect(result.current).toMatchObject(
      expect.objectContaining({
        isLoading: true,
        data: undefined,
      })
    )

    await actWait(500)

    expect(init).toHaveBeenCalled()
    expect(getVisitorData).toHaveBeenCalled()
    expect(result.current).toMatchObject(
      expect.objectContaining({
        isLoading: false,
        data: testData,
      })
    )
  })

  it("shouldn't call getData on mount if 'immediate' option is set to false", async () => {
    getVisitorData.mockImplementation(() => testData)

    const wrapper = createWrapper()
    const { rerender } = renderHook(() => useVisitorData({}, { immediate: false }), { wrapper })

    expect(getVisitorData).not.toHaveBeenCalled()

    await rerender()

    expect(getVisitorData).not.toHaveBeenCalled()
  })

  it('should support immediate fetch with cache disabled', async () => {
    const wrapper = createWrapper()
    renderHook(() => useVisitorData({ ignoreCache: true }, { immediate: true }), { wrapper })

    await actWait(500)

    expect(getVisitorData).toHaveBeenCalledTimes(1)
    expect(getVisitorData).toHaveBeenCalledWith({}, true)
  })

  it('should support overwriting default cache option in getData call', async () => {
    const wrapper = createWrapper()
    const hook = renderHook(() => useVisitorData({ ignoreCache: true }, { immediate: false }), { wrapper })

    await act(async () => {
      await hook.result.current.getData({
        ignoreCache: false,
      })
    })

    expect(getVisitorData).toHaveBeenCalledTimes(1)
    expect(getVisitorData).toHaveBeenCalledWith({}, false)
  })

  it('should re-fetch data when options change if "immediate" is set to true', async () => {
    const Component = () => {
      const [extended, setExtended] = useState(false)
      const { data } = useVisitorData({ extendedResult: extended }, { immediate: true })

      return (
        <>
          <button onClick={() => setExtended((prev) => !prev)}>Change options</button>
          <pre>{JSON.stringify(data)}</pre>
        </>
      )
    }

    const Wrapper = createWrapper()

    const { container } = render(
      <Wrapper>
        <Component />
      </Wrapper>
    )

    await actWait(1000)

    act(() => {
      userEvent.click(container.querySelector('button')!)
    })

    await actWait(1000)

    expect(getVisitorData).toHaveBeenCalledTimes(2)
    expect(getVisitorData).toHaveBeenNthCalledWith(1, { extendedResult: false }, undefined)
    expect(getVisitorData).toHaveBeenNthCalledWith(2, { extendedResult: true }, undefined)
  })

  it('should correctly pass errors from SPA library', async () => {
    getVisitorData.mockRejectedValue(new Error(FingerprintJSPro.ERROR_CLIENT_TIMEOUT))

    const wrapper = createWrapper()
    const hook = renderHook(() => useVisitorData({ ignoreCache: true }, { immediate: false }), { wrapper })

    await act(async () => {
      const promise = hook.result.current.getData({
        ignoreCache: false,
      })

      await expect(promise).rejects.toThrow(FingerprintJSPro.ERROR_CLIENT_TIMEOUT)
    })

    expect(hook.result.current.error?.message).toBe(FingerprintJSPro.ERROR_CLIENT_TIMEOUT)
  })

  it('`getVisitorData` `getOptions` should be passed from `getVisitorData` `getOptions`', async () => {
    const useVisitorDataId = 'useVisitorDataId'
    const wrapper = createWrapper()
    const hook = renderHook(
      () =>
        useVisitorData(
          {
            linkedId: useVisitorDataId,
            tag: { tagA: useVisitorDataId },
          },
          { immediate: false }
        ),
      { wrapper }
    )

    await act(async () => {
      await hook.result.current.getData()
    })
    expect(getVisitorData).toHaveBeenCalledTimes(1)
    expect(getVisitorData).toHaveBeenCalledWith(
      { linkedId: useVisitorDataId, tag: { tagA: useVisitorDataId } },
      undefined
    )
  })

  it('`getData` `getOptions` should be more important than `getVisitorData` `getOptions`', async () => {
    const getDataId = 'getDataId'
    const useVisitorDataId = 'useVisitorDataId'
    const wrapper = createWrapper()
    const hook = renderHook(
      () =>
        useVisitorData(
          {
            linkedId: useVisitorDataId,
            tag: { tagA: useVisitorDataId },
          },
          { immediate: false }
        ),
      { wrapper }
    )

    await act(async () => {
      await hook.result.current.getData({
        linkedId: getDataId,
        tag: { tagA: getDataId },
      })
    })
    expect(getVisitorData).toHaveBeenCalledTimes(1)
    expect(getVisitorData).toHaveBeenCalledWith({ linkedId: getDataId, tag: { tagA: getDataId } }, undefined)
  })

  it('`getData` `getOptions` should extend `getVisitorData` `getOptions`', async () => {
    const getDataId = 'getDataId'
    const useVisitorDataId = 'useVisitorDataId'
    const wrapper = createWrapper()
    const hook = renderHook(
      () =>
        useVisitorData(
          {
            linkedId: useVisitorDataId,
            tag: { tagA: useVisitorDataId },
          },
          { immediate: false }
        ),
      { wrapper }
    )

    await act(async () => {
      await hook.result.current.getData({
        linkedId: getDataId,
      })
    })
    expect(getVisitorData).toHaveBeenCalledTimes(1)
    expect(getVisitorData).toHaveBeenCalledWith({ linkedId: getDataId, tag: { tagA: useVisitorDataId } }, undefined)
  })

  it('getData should only change if the getOptions semantically changes', async () => {
    // This test will result in the component rendering four times:
    // 1. The initial render - the getData callback is initially created
    // 2. Count is incremented from 0 to 1 - the getData callback should not change because getOptions did not change
    // 3. Count is incremented from 1 to 2 - getOptions changes but the getData callback does not change this render
    // 4. useVisitorData updated its state during the previous render and the previous render is thrown away and
    //    another render is triggered
    // Notably, the effects for the component are not executed between 3 and 4.
    //
    // More information about this pattern can be found at:
    // https://react.dev/reference/react/useState#storing-information-from-previous-renders

    const getDataValues: VisitorQueryContext<false>['getData'][] = []
    let effectCount = 0
    const Component = () => {
      const [count, setCount] = useState(0)
      const { data, getData } = useVisitorData(count <= 1 ? { timeout: 1000 } : { timeout: 2000 }, { immediate: false })

      useEffect(() => {
        effectCount++
      })

      getDataValues.push(getData)
      return (
        <>
          <button onClick={() => setCount((count) => count + 1)}>Increment count</button>
          <pre>{JSON.stringify(data)}</pre>
        </>
      )
    }

    const Wrapper = createWrapper()

    const { container } = render(
      <Wrapper>
        <Component />
      </Wrapper>
    )

    await act(async () => {
      await userEvent.click(container.querySelector('button')!)
    })

    await act(async () => {
      // This second click needs to be in a separate act otherwise
      // React will coalesce the state updates to the count into a
      // a single update. Meaning that count will jump from 0 to 2
      // in between renders if this click were in the previous act block.
      // This ensures that the case is covered where the options
      // object does not semantically change.
      await userEvent.click(container.querySelector('button')!)
    })

    expect(getDataValues).toHaveLength(4)
    expect(getDataValues[0]).toBe(getDataValues[1])
    expect(getDataValues[2]).not.toBe(getDataValues[3])
    expect(effectCount).toEqual(3)
  })
})
