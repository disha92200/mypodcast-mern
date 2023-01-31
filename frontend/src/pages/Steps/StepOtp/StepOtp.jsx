import React, { useState } from "react";
import Button from "../../../components/Button/Button";
import Card from "../../../components/Card/Card";
import styles from "./StepOtp.module.css";
import { verifyOtp } from "../../../http";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../../../store/authSlice";

const StepOtp = ({ onClick }) => {
  const [otp, setOtp] = useState();
  const { phone, hash } = useSelector((state) => state.auth.otp);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    try {
      const { data } = await verifyOtp({ otp, phone, hash });
      console.log(data);
      dispatch(setAuth({ user: data.user }));
      //navigate("/activate");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.CardWrapper}>
      <Card title="Enter the code we just texted you" logo="./images/otp.png">
        <div className={styles.InputWrapper}>
          <input
            className={styles.Input}
            type="number"
            onChange={(e) => {
              setOtp(e.target.value);
            }}
            onWheel={(e) => e.target.blur()}
          />
          {/* <input className={styles.Input} type='number'/>
            <input className={styles.Input} type='number'/>
            <input className={styles.Input} type='number'/> */}
        </div>
        <div className={styles.TextWrapper}>Didn’t receive? Tap to resend</div>
        <div className={styles.ButtonWrapper}>
          <Button text="Next" onSubmit={handleSubmit} />
        </div>
      </Card>
    </div>
  );
};

export default StepOtp;
