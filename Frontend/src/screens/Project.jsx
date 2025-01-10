import axios from "../config/Axios";
import React, { createRef, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import { useLocation, useNavigate } from "react-router-dom";
import { initilizeSocket, receiveMessage, sendMessage } from "../config/socket";

const Project = () => {
  const [sidepanelOpen, setSidepanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [projectusers, setProjectusers] = useState(null);
  const messagebox = createRef();

  useEffect(() => {
    if (!location.state || !location.state.project) {
      navigate("/");
      return;
    }

    setProjectusers(location.state.project);

    const fetchProjectData = async () => {
      try {
        const res = await axios.get(`/project/get-project/${location.state.project._id}`);
        setProjectusers(res.data.project);
      } catch (err) {
        console.error("Error fetching projectusers:", err);
        setProjectusers(null);
      }
    };

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

  useEffect(() => {
    if (projectusers) {
      const socket = initilizeSocket(projectusers._id); // Initialize the socket

      // Clean up any existing listeners to avoid duplicate messages
      socket.off("project-msg");

      // Listen for new messages
      receiveMessage("project-msg", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      // Cleanup on component unmount
      return () => {
        socket.off("project-msg");
      };
    }
  }, [projectusers]);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when messages change
  }, [messages]);

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

  const handleSendMessage = () => {
    if (!message) {
      console.error("Message is empty");
      return;
    }

    const messageData = {
      message,
      sender: user._id,
      senderEmail: user.email,
      projectId: projectusers._id,
    };

    sendMessage("project-msg", messageData);
    setMessage("");
    setMessages((prevMessages) => [...prevMessages, messageData]);
  };

  function scrollToBottom() {
    if (messagebox.current) {
      // Use setTimeout to delay the scroll a little bit and allow the DOM to update
      setTimeout(() => {
        messagebox.current.scrollTop = messagebox.current.scrollHeight;
      }, 50);  // Small delay to ensure the DOM has finished updating
    }
  }

  if (!projectusers) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <main className="h-screen w-screen flex overflow-x-hidden scrollbar-hidden ">
        {/* Left Section */}
        <section className="left flex flex-col min-w-[24rem] relative border-r border-gray-300">
          {/* Fixed Header */}
          <header className="flex lg:w-[28%] md:w-[50%] w-[77%]  p-4 justify-between bg-gray-200 fixed top-0 z-10">
            <button
              className="flex gap-2 items-center text-sm"
              onClick={() => setModalOpen(true)}
            >
              Add Members <i className="ri-add-fill text-xl"></i>
            </button>
            <button onClick={() => setSidepanelOpen(!sidepanelOpen)}>
              <i className="ri-group-fill text-xl p-2 rounded-full bg-gray-300"></i>
            </button>
          </header>

          {/* Conversation Area */}
          <div className="conversation-box flex-grow flex flex-col relative bg-gray-100 mt-[64px]">
            <div
              ref={messagebox}
              className="message flex-grow overflow-auto p-2 scrollbar-hidden"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-xs ${
                    msg.sender === user._id
                      ? "ml-auto bg-blue-500 text-white"
                      : "bg-gray-200"
                  } mt-2`}
                >
                  <small className="block text-xs">{msg.senderEmail}</small>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>
            {/* Input Area */}
            <div className="input sticky bottom-0 flex bg-white p-2 border-t border-gray-300">
              <input
                className="flex-grow p-2 rounded-md border border-gray-300"
                type="text"
                placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="ml-2 p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleSendMessage}
              >
                <i className="ri-send-plane-fill text-lg"></i>
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div
            className={`sidepanel absolute top-0 left-0 w-full h-full bg-white transition-transform ${
              sidepanelOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <header className="flex justify-between p-4 bg-gray-200 fixed w-full top-0 z-10">
              <h1 className="text-lg">Members</h1>
              <button onClick={() => setSidepanelOpen(!sidepanelOpen)}>
                <i className="ri-close-fill text-lg"></i>
              </button>
            </header>
            <div className="users flex flex-col p-4 gap-3 mt-[64px]">
              {projectusers.users.length > 0 ? (
                projectusers.users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <i className="ri-user-fill text-lg"></i>
                    </div>
                    <h1 className="text-sm">{user.email}</h1>
                  </div>
                ))
              ) : (
                <p>No users available.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Modal for adding members */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-4">Select Users</h2>
            <div className="max-h-60 overflow-y-auto">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <i className="ri-user-fill text-lg"></i>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full ${
                        selectedUsers.includes(user._id)
                          ? "bg-blue-500"
                          : "border border-gray-300"
                      }`}
                    ></div>
                  </div>
                ))
              ) : (
                <p>No users found.</p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={addMembers}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
