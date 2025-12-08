import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// IMPORTANT: Check where you saved the new Login file I gave you.
// If you saved it in 'src/pages/Login.tsx', change this line to: import Login from './pages/Login'
import Login from './components/Login'
import Home from './pages/Home'

// 1. Create the Query Client instance
const queryClient = new QueryClient()

function App() {
  return (
    // 2. Wrap your entire App with the Provider
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App