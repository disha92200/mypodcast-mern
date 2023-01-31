import React from 'react'
import Card from '../../../../components/Card/Card'
import Button from '../../../../components/Button/Button'
import styles from './Email.module.css'

const Email = ({onClick}) => {
  return (
    <Card title="Enter your email id" logo="./images/email.png">
            <div className={styles.InputWrapper}>
            <input className={styles.Input} type='text' />
            </div>
            <div className={styles.ButtonWrapper}>
            <Button text='Next' onSubmit={onClick}/>
            </div>
            <div className={styles.TextWrapper}>
            By entering your number, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!
            </div>
        </Card>
  )
}

export default Email
