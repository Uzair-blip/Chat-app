import axios from "../config/Axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Project = () => {
  const [sidepanelOpen, setSidepanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [projectusers, setProjectusers] = useState(null);

  useEffect(() => {
    // Check if location.state exists, if not redirect to home
    if (!location.state || !location.state.project) {
      navigate('/');
      return;
    }

    // Set initial project data
    setProjectusers(location.state.project);
    
    // Fetch updated project data
    const fetchProjectData = async () => {
      try {
        const res = await axios.get(`/project/get-project/${location.state.project._id}`);
        setProjectusers(res.data.project);
        console.log(projectusers)
      } catch (err) {
        console.error("Error fetching projectusers:", err);
        setProjectusers(null);
      }
    };

    // Fetch users data
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/user/allusers");
        setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      }
    };

    fetchProjectData();
    fetchUsers();
  }, [location.state, navigate]);
  
  async function addMembers() {
    if (!location.state?.project?._id) {
        console.error("Project ID is undefined");
        return;
    }

    try {
        const response = await axios.put("/project/adduser", {
            projectId: location.state.project._id,
            users: Array.from(selectedUsers),
        });

        if (response.status === 200) {
            setModalOpen(false);
            setSelectedUsers([]);
            // Fetch updated project data after adding members
            const res = await axios.get(`/project/get-project/${location.state.project._id}`);
            setProjectusers(res.data.project);
            console.log("Users added successfully");
        }
    } catch (error) {
        console.error("Error adding members:", error);
    }
}

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.includes(userId);
      return isSelected ? prev.filter((id) => id !== userId) : [...prev, userId];
    });
  };

  // If no project data is available, show loading or redirect
  if (!projectusers) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <main className="h-screen w-screen flex">
        {/* Left Section */}
        <section className="left h-full flex flex-col min-w-96 relative border border-r-2">
          <header className="flex w-full p-4 justify-between bg-slate-200">
            <button
              className="flex gap-2 items-center justify-center"
              onClick={() => setModalOpen(true)}
            >
              <small>Add Members :</small>
              <i className="ri-add-fill text-xl mt-1 hover:bg-white hover:rounded-full"></i>
            </button>
            <button onClick={() => setSidepanelOpen(!sidepanelOpen)}>
              <i className="ri-group-fill text-xl p-2 rounded-full bg-slate-400"></i>
            </button>
          </header>
          <div className="conversation-box flex-grow flex flex-col bg-slate-300">
            <div className="message flex flex-col flex-grow">
              <div className="incoming-msg p-4 flex flex-col gap-1 max-w-56 m-2 min-h-10 rounded-lg bg-slate-50 mt-3">
                <small className="opacity-65 text-xs">ali@gmail.com</small>
                <p className="leading-4 text-sm">Lorem ipsum dolor sit amet.</p>
              </div>
              <div className="outgoing-msg p-4 ml-auto flex flex-col gap-1 w-56 m-2 min-h-10 rounded-lg bg-white mt-3">
                <small className="opacity-65 text-xs">ali@gmail.com</small>
                <p className="leading-4 text-sm">Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
            <div className="input flex w-full">
              <input
                className="p-2 px-4 border-none outline-none w-[85%]"
                type="text"
                placeholder="Enter message"
              />
              <button className="flex-grow bg-white">
                <i className="ri-send-plane-fill text-2xl"></i>
              </button>
            </div>
          </div>
          <div
            className={`sidepanel w-full h-full flex flex-col gap-2 bg-white absolute top-0 transition-all ${
              sidepanelOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <header className="flex  w-full p-4 justify-between bg-slate-200">
             <h1 className="text-xl">Members </h1>
              <button onClick={() => setSidepanelOpen(!sidepanelOpen)}>
                <i className="ri-close-fill text-xl p-2 rounded-full bg-white"></i>
              </button>

            </header>
            <div className="users flex flex-col gap-2">
              {projectusers.users.length > 0 ? (
                projectusers.users.map((user) => (
                  <div
                    key={user._id}
                    className="user flex gap-3 cursor-pointer hover:bg-slate-200 p-2"
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="p-4 aspect-square bg-slate-300 rounded-full w-fit h-fit items-center relative">
                      <i className="ri-user-fill w-fit h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
                    </div>
                    <h1 className="font-semibold">{user.email}</h1>
                  </div>
                ))
              ) : (
                <p>No users is available.</p>
              )}
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className="right h-full flex-grow">
          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Select Users</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setModalOpen(false)}
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                        onClick={() => handleUserSelect(user._id)}
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <i className="ri-user-fill text-gray-600"></i>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="w-6 h-6 border-2 rounded-full flex items-center justify-center">
                          <div
                            className={`w-3 h-3 bg-blue-500 rounded-full ${
                              selectedUsers.includes(user._id) ? "block" : "hidden"
                            }`}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No users found.</p>
                  )}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button onClick={addMembers} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Add Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Project;
