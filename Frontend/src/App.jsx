import React from 'react'
import {Route,Routes} from "react-router-dom"
import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'
import { UserProvider } from './context/user.context.jsx'
import Project from './screens/project.jsx'
import UserAuth from './auth/UserAuth.jsx'


const App = () => {
  return (
    <div>
      
<UserProvider>
 <Routes>
 <Route path='/' element={<UserAuth><Home/></UserAuth>}/>
 <Route path='/login' element={<Login/>}/>
 <Route path='/register' element={<Register/>}/>
 <Route path="/project" element={<UserAuth><Project/></UserAuth>}/>
</Routes>
</UserProvider>
    </div>
  )
}

export default App
