import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'
import { ErrorTrackingProvider } from './hooks/useErrorTracking.jsx'
import router from './routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ErrorTrackingProvider>
        <RouterProvider router={router} />
      </ErrorTrackingProvider>
    </AuthProvider>
  </StrictMode>,
)
