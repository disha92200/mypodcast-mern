import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../http";
import { setName,setAvatar } from "../../store/activateSlice";
import { setAuth } from "../../store/authSlice";
import Button from "../Button/Button";
import styles from "./Navigation.module.css";
import {Link} from 'react-router-dom'

const Navigation = () => {
  const dispatch = useDispatch();
  const { isAuth,user } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    dispatch(setName(''))
    dispatch(setAvatar(''))
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (err) {
      //console.log(err)
    }
  };
  return (
    <nav className={styles.NavbarWrapper}>
      <div className={styles.Navbar}>
        <div className={styles.navLeft}>
          <img
            className={styles.logoImg}
            src="/images/Emoji.png"
            alt="logo"
          ></img>
          <span className={styles.logoText}>My Podcast</span>
        </div>
        {isAuth&&  (
          <div className={styles.navRight}>
            {user.activated&&<>
              <span className={styles.name}>{user.name}</span>
            <Link to='/'><img className={styles.avatar} src={user.avatar} alt="logo" /></Link>
            </>}
            <button className={styles.logoutButton} onClick={handleLogout}>
              <img src="/images/logout.png" alt="logo" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
