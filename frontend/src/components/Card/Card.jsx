import React from 'react'
import styles from './Card.module.css'

const Card = ({logo,title,children}) => {
  return (
    <div className={styles.Card}>
        <div className={styles.HeadingWrapper}>
            {logo&&<img className={styles.HeadingLogo} src={logo} alt="logo" />}
            {title&&<span className={styles.HeadingText}>{title}</span>}
        </div>
        {children}
      
    </div>
  )
}

export default Card
