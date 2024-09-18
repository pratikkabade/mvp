import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppRoutes } from './routes/AppRoutes.tsx'
import './styles/App.css'
import './styles/Animations.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
)
