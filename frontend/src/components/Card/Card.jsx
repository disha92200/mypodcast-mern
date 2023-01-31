import React from 'react'
import styles from './Card.module.css'

const Card = ({logo,title,children}) => {
  return (
    <div className={styles.Card}>
        <div className={styles.HeadingWrapper}>
            <img className={styles.HeadingLogo} src={logo} alt="logo" />
            <span className={styles.HeadingText}>{title}</span>
        </div>
        {children}
      
    </div>
  )
}

export default Card
