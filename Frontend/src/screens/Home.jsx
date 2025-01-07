import React, { useContext, useState } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/Axios"
const Home = () => {
  const { user } = useContext(UserContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('')

  const handleSubmit =async (e) => {
    e.preventDefault()

    await axios.post("/project/create",{
      name:projectName
    })
    .then((response) => {
      console.log('Project created successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error creating project:', error.response?.data?.message || error.message);
    });
    setIsModalOpen(false)
    setProjectName('')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Project
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="modal p-8 rounded-lg shadow-xl bg-white">
              <div className="modal-content">
                <h3 className="text-2xl font-semibold mb-4">Create New Project</h3>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="projectName"
                    placeholder="Enter project name"
                    className="w-full p-2 border rounded mb-4"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Create
                    </button >
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home