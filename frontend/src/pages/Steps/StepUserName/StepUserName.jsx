import React from 'react'
import  Button from '../../../components/Button/Button'

const StepUserName = ({onClick}) => {
  return (
    <div>
      <p>Step Username</p>
      <Button text='Next' onSubmit={onClick}/>
    </div>
  )
}

export default StepUserName
