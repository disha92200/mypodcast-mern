import React from 'react'
import { useLocation } from 'react-router-dom'

const Room = () => {
  const location=useLocation();
  const id=location.pathname.replace('/room/','')
  return (
    <div>
      hello from {id}
    </div>
  )
}

export default Room
