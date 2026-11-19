import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SearchProvider } from './lib/SearchContext.jsx'
import { applyTheme, readTheme, watchTheme } from './utils/theme.js'
import './light-theme.generated.css'
import './light-theme.css'

applyTheme(readTheme())
watchTheme(() => {})

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SearchProvider>
      <App />
    </SearchProvider>
  </BrowserRouter>
)
