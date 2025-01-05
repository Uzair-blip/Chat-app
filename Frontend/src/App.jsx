import React from 'react'
import {Route,Routes} from "react-router-dom"
import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'
import { UserProvider } from './context/user.context.jsx'


const App = () => {
  return (
    <div>
      
<UserProvider>
 <Routes>
 <Route path='/' element={<Home/>}/>
 <Route path='/login' element={<Login/>}/>
 <Route path='/register' element={<Register/>}/>
</Routes>
</UserProvider>
    </div>
  )
}

export default App
