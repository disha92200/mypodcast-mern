import React from 'react'
import { useSelector } from 'react-redux'

const Rooms = () => {
  const {name,avatar}=useSelector((state)=>state.auth.user)
  return (
    <div>
      Room component
    </div>
  )
}

export default Rooms
