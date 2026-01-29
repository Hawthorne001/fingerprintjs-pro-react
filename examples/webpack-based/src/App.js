import { useVisitorData } from '@fingerprint/react'

function App() {
  const { isLoading, error, data } = useVisitorData()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>An error occurred: {error.message}</div>
  }

  if (data) {
    return <div>Welcome {data.visitor_id}!</div>
  }
  return null
}

export default App
