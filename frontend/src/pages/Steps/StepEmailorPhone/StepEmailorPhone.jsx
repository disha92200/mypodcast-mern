import React, { useState } from "react";
//import  Button from '../../../components/Button/Button'
import Email from "./Email/Email";
import Phone from "./Phone/Phone";
import styles from "./StepEmailorPhone.module.css";

const StepEmailorPhone = ({ onClick }) => {
  const [type, setType] = useState("phone");
  const EmailPhoneMap = {
    email: Email,
    phone: Phone,
  };
  const LeftButtonStyle = {
    backgroundColor: type === "phone" ? "#fff" : "#6096B4",
  };
  const RightButtonStyle = {
    backgroundColor: type === "email" ? "#fff" : "#6096B4",
    // marginLeft: "10px",
  };
  const TypeComponent = EmailPhoneMap[type];
  return (
    <div className={styles.Container}>
      <div className={styles.ButtonWrapper}>
        <button
          className={styles.TypeButton}
          style={LeftButtonStyle}
          onClick={() => {
            setType("phone");
          }}
        >
          <img
            className={styles.buttonImage}
            src="/images/phone-black.png"
            alt="phone"
          />
        </button>
        <button
          className={styles.TypeButton}
          style={RightButtonStyle}
          onClick={() => setType("email")}
        >
          <img
            className={styles.buttonImage}
            src="/images/email-black.png"
            alt="email"
          />
        </button>
      </div>
      <div className={styles.CardWrapper}>
        <TypeComponent onClick={onClick} />
      </div>
    </div>
  );
};

export default StepEmailorPhone;

// <p>Step Email or Phone</p>
//         <Button text='Next' onSubmit={onClick}/>
