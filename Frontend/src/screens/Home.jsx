import React, { useContext } from 'react'
import { UserContext } from '../context/user.context'
const Home = () => {
  const {user}=useContext(UserContext)
  return (
    <div>{user ? JSON.stringify(user) : 'No user data available'}</div>
  );
  
}

export default Home