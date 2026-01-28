'use client'

import styles from '../styles/Home.module.css'
import { useVisitorData } from '@fingerprint/react'

const HomePage = () => {
  const { isLoading, error, data, getData } = useVisitorData({ immediate: true })

  const reloadData = () => {
    getData({})
  }

  return (
    <div className={styles.container}>
      <h1>FingerprintJS Pro NextJS Demo</h1>
      <div className={styles.testArea}>
        <div className={styles.description}>
          Lets load FingerprintJS Pro Agent using react integration and check next things:
        </div>
        <ol className={styles.actionPoints}>
          <li>There is no errors on server</li>
          <li>There is no errors on client</li>
          <li>In the field below visitor data was loaded</li>
          <li>Try controls to test additional params</li>
        </ol>
        <div className={styles.controls}>
          <button onClick={reloadData} type='button'>
            Reload data
          </button>
        </div>
        <h4>
          VisitorId: <span className={styles.visitorId}>{isLoading ? 'Loading...' : data?.visitor_id}</span>
        </h4>
        <h4>Full visitor data:</h4>
        <pre className={styles.data}>{error ? error.message : JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}

export default HomePage
