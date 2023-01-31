import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import {useSelector} from 'react-redux'

const ProtectedRoute = () => {
  const {user,isAuth}=useSelector((state)=>state.auth)

  return (
    !isAuth?
    <Navigate to='/'/>:
    isAuth&&!user.activate?
    <Navigate to='/activate'/>:
    <Outlet/>
  )
}

export default ProtectedRoute
