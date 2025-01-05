import React, { useContext, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from "../config/Axios"
import { UserContext } from '../context/user.context'
const Login = () => {
  const [formData, setFormData] = useState({  
    email: '',
    password: ''
  })
  const {setUser}=useContext(UserContext)
const navigate=useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const handleSubmit =async  (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
     
    try {
      const response = await axios.post('/user/login', formData);
      console.log('Login successful:', response.data);
  
      // Store the token and user in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
  
      // Set user in context
      setUser(response.data.user);
  
      navigate("/");
  } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
  }
  finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login to your Chat </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
                      {loading ? 'Logging in...' : 'Login'}

          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-400">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login