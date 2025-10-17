import React from 'react'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Kaiburr Task Manager</h1>
      <p>Frontend is working! 🎉</p>
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <h2>Test API Connection</h2>
        <button onClick={() => {
          fetch('/api/tasks')
            .then(res => res.json())
            .then(data => alert(`Found ${data.length} tasks`))
            .catch(err => alert('API Error: ' + err.message))
        }}>
          Test Backend API
        </button>
      </div>
    </div>
  )
}

export default App