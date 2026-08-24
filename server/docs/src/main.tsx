import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import ArchitectureMap from './architecture/components/ArchitectureMap'
import { ARCHITECTURE } from './architecture/graph'
import './architecture/components/keyframes.css'
import './app.css'

function App() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <>
      <ArchitectureMap data={ARCHITECTURE} />
      <button className="theme-toggle" type="button" onClick={() => setDark((value) => !value)}>
        {dark ? 'Light map' : 'Dark map'}
      </button>
    </>
  )
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
