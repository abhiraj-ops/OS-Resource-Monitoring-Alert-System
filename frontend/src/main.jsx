import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { ErrorTrackingProvider } from './hooks/useErrorTracking.jsx'
import router from './routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ErrorTrackingProvider>
          <RouterProvider router={router} />
        </ErrorTrackingProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
