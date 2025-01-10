import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate } from 'react-router-dom'

const UserAuth = ({children}) => {
    const {user, loading} = useContext(UserContext)
    const navigate = useNavigate()
const token=localStorage.getItem("token")
    useEffect(() => {
        if (!loading && (!user || !token)) {
            navigate('/login')
        }
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
        {children}
        </>
    )
}

export default UserAuth