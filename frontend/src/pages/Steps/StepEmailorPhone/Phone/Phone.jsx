import React from "react";
import Card from "../../../../components/Card/Card";
import Button from "../../../../components/Button/Button";
import styles from "./Phone.module.css";
import { sendOtp } from "../../../../http";
import { useState } from "react";
import { setOtp } from "../../../../store/authSlice";
import { useDispatch } from "react-redux";

const Phone = ({ onClick }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if(!phoneNumber){
      alert('Please enter your phone number !')
      return;
    }
    const phone = `+91${phoneNumber}`;
    const { data } = await sendOtp({ phone });
    console.log(data);
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    onClick();
  };
  return (
    <Card title="Enter your phone number" logo="./images/phone.png">
      <div className={styles.InputWrapper}>
        <input
          className={styles.Input}
          type="number"
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
          onWheel={(e) => e.target.blur()}
        />
      </div>
      <div className={styles.ButtonWrapper}>
        <Button text="Next" onSubmit={handleSubmit} />
      </div>
      <div className={styles.TextWrapper}>
        By entering your number, you’re agreeing to our Terms of Service and
        Privacy Policy. Thanks!
      </div>
    </Card>
  );
};

export default Phone;
