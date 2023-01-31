import React, { useState } from "react";
import Card from "../../components/Card/Card";
import styles from "./Home.module.css";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const RegisterLink = () => {
    navigate("/authenticate");
    console.log("hello");
  };
  const SignInStyle = {
    color: isHover ? "#004dff" : "#0077ff",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <div className={styles.CardWrapper}>
      <Card title="Welcome to My Podcast!" logo="./images/Emoji.png">
        <div className={styles.BodyTextWrapper}>
          We’re working hard to get My Podcast ready for everyone! While we wrap
          up the finishing touches, we’re adding people gradually to make sure
          nothing breaks.
        </div>
        <div className={styles.ButtonWrapper}>
          <Button text="Let's Go" onSubmit={RegisterLink} />
        </div>
        <div className={styles.SignInWrapper}>
          <span className={styles.HaveInvite}>Have an invite text?</span>
          <Link
            style={SignInStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            to="/authenticate"
          >
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;
