import React from 'react'
import styles from './Button.module.css'

const Button = ({text,onSubmit}) => {
  return (
    <button className={styles.Button} onClick={onSubmit}>
        <span className={styles.ButtonText}>{text}</span>
        <img src="./images/arrow_forward.png" alt="arrow" />
    </button>
  )
}

export default Button
