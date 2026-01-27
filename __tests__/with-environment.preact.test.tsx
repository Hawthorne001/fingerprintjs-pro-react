import { render as preactRender } from '@testing-library/preact'
import { h } from 'preact'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import * as compat from 'preact/compat'

describe('WithEnvironment', () => {
  describe('when running within Preact', () => {
    beforeEach(() => {
      vi.doMock('react', () => compat)
      vi.doMock('react-dom', () => compat)
    })

    afterEach(() => {
      vi.resetAllMocks()
    })
    it('should detect env as "preact"', async () => {
      const { WithEnvironment } = await import('../src/components/with-environment')
      const PrintEnv = (props: any) => h('div', null, props?.env?.name)

      // @ts-ignore
      const { container } = preactRender(h(WithEnvironment, null, h(PrintEnv, null)))

      expect(container.innerHTML).toContain('preact')
    })
  })
})
