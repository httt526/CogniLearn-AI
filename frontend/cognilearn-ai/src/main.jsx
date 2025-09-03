import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import './index.css'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  </StrictMode>,
)
