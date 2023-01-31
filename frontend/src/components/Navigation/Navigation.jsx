import React from 'react'
import styles from './Navigation.module.css'

const Navigation = () => {
  return (
    <nav className={styles.NavbarWrapper}>
        <div className={styles.Navbar}>
            <img className={styles.logoImg} src='/images/Emoji.png' alt='logo'></img>
            <span className={styles.logoText}>My Podcast</span>
        </div>
    </nav>
  )
}

export default Navigation
