import React, { useState } from "react";
import Button from "../../../components/Button/Button";
import Card from "../../../components/Card/Card";
import styles from "./StepOtp.module.css";
import { verifyOtp, sendOtp } from "../../../http";
import { useSelector, useDispatch } from "react-redux";
import { setAuth, setOtp } from "../../../store/authSlice";

const StepOtp = ({ onClick }) => {
  const [givenOtp, setGivenOtp] = useState();
  const { phone, hash } = useSelector((state) => state.auth.otp);
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if (!phone || !hash || !givenOtp) {
      alert("Please enter otp !");
      return;
    }
    let res;
    try {
      res = await verifyOtp({ otp: givenOtp, phone, hash });
      const { data } = res;
      //console.log(data);
      dispatch(setAuth({ user: data.user }));
      //navigate("/activate");
    } catch (err) {
      alert(err.response.data.message);
      console.log(err.response.data.message);
    }
  };
  const handleResend = async () => {
    const { data } = await sendOtp({ phone });
    console.log(data);
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
  };

  return (
    <div className={styles.CardWrapper}>
      <Card title="Enter the code we just texted you" logo="./images/otp.png">
        <div className={styles.InputWrapper}>
          <input
            className={styles.Input}
            type="number"
            onChange={(e) => {
              setGivenOtp(e.target.value);
            }}
            onWheel={(e) => e.target.blur()}
          />
          {/* <div className={styles.inputWithIcon}>
            <img src="/images/flag.png" alt="" />
            
          </div> */}
          {/* <input className={styles.Input} type='number'/>
            <input className={styles.Input} type='number'/>
            <input className={styles.Input} type='number'/> */}
        </div>
        <div className={styles.TextWrapper}>
          Didn’t receive?{" "}
          <div className={styles.resendText} onClick={handleResend}>
            Tap to resend
          </div>
        </div>
        <div className={styles.ButtonWrapper}>
          <Button text="Next" onSubmit={handleSubmit} />
        </div>
      </Card>
    </div>
  );
};

export default StepOtp;
