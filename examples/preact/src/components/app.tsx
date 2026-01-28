import { FunctionalComponent } from 'preact'
import { useVisitorData } from '@fingerprint/react'

const App: FunctionalComponent = () => {
  const { isLoading, error, data, getData } = useVisitorData({ immediate: true })

  const reloadData = (): void => {
    getData()
  }

  return (
    <div id='preact_root' className='container'>
      <h1>FingerprintJS Pro Preact Demo</h1>
      <div className='testArea'>
        <div className='description'>
          Lets load FingerprintJS Pro Agent using react integration and check next things:
        </div>
        <ol className='actionPoints'>
          <li>There is no errors on server</li>
          <li>There is no errors on client</li>
          <li>In the field below visitor data was loaded</li>
          <li>Try controls to test additional params</li>
        </ol>
        <div className='controls'>
          <button onClick={reloadData} type='button'>
            Reload data
          </button>
        </div>
        <h4>
          VisitorId: <span className='visitorId'>{isLoading ? 'Loading...' : data?.visitor_id}</span>
        </h4>
        <h4>Full visitor data:</h4>
        <pre className='data'>{error ? error.message : JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}

export default App
