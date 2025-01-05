import React from 'react'
import {Route,Routes} from "react-router-dom"
import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'

const App = () => {
  return (
    <div>
 <Routes>
 <Route path='/' element={<Home/>}/>
 <Route path='/login' element={<Login/>}/>
 <Route path='/register' element={<Register/>}/>
</Routes>
    </div>
  )
}

export default App
