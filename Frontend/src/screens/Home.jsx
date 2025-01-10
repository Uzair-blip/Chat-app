import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/Axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { user, setUser } = useContext(UserContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [project, setProject] = useState([]);
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post("/user/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  //fetch all projects from db
  const fetchProjects = async () => {
    if (!user) {
      return;
    }
  
    try {
      const res = await axios.get("/project/all");
      setProject(res.data.projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };
  
  //when click on submit it will create project 
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("/project/create", {
        name: projectName
      });
      
      // Fetch updated projects list after creating new project
      await fetchProjects();
      
      setIsModalOpen(false);
      setProjectName('');
    } catch (error) {
      console.error('Error creating project:', error.response?.data?.message || error.message);
    }
  }

  //this is render on home page without reloading 
  useEffect(() => {
    if (user) {
      // Fetch projects only if the user is authenticated
      fetchProjects();
    }
  }, [user]);
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Project
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="flex gap-3">
          <div className='flex flex-row-reverse gap-2  ' > 
          {project.length === 0 ? (
            // Skeleton loader cards
            <>
              <div className="flex flex-col bg-gray-200 gap-2 w-[10%] p-4 animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
              </div>
              <div className="flex flex-col bg-gray-200 gap-2 w-[10%] p-4 animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
              </div>
            </>
          ) : (
  
            project.map((proj) => (
              <div 
                key={proj._id} 
                onClick={() => navigate('/project', { state: { project: proj } })}
                className='flex flex-col border gap-2 min-w-24 hover:bg-slate-100 cursor-pointer p-4'
              >
                <h3 className="text-xl font-semibold mb-2">{proj.name}</h3>
                <div className="flex gap-2 mb-2">
                 <p>
                  <i className="ri-user-fill p-1 "></i>
               <small>  Members: </small> 
                  {proj.users.length}
                 </p>
                  </div>
              </div>
            ))
          )}
    </div>
          </div>
        </div>
              <div>
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