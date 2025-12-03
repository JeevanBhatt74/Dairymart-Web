import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  const userId = localStorage.getItem('userId')
  const role = localStorage.getItem('role')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Dairy Go</h1>
      <p className="mb-4">You are logged in as: {role || 'guest'} {userId ? `(${userId})` : ''}</p>
      <div className="space-x-4">
        <Link to="/login" className="text-blue-600 hover:underline">Logout</Link>
      </div>
    </div>
  )
}

export default Home
