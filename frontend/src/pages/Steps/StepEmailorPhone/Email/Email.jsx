import React from "react";
import Card from "../../../../components/Card/Card";
import Button from "../../../../components/Button/Button";
import styles from "./Email.module.css";
import { GoogleLogin } from "@react-oauth/google";
import { loginEmail } from "../../../../http";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../../store/authSlice";

const Email = ({ onClick }) => {
  const dispatch = useDispatch();
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { data } = await loginEmail({
        token: credentialResponse.credential,
      });
      console.log(data);
      dispatch(setAuth({ user: data.user }));
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <Card title="Login/SignUp using email id" logo="./images/email.png">
      {/* <div className={styles.InputWrapper}>
        <input className={styles.Input} type="text" />
      </div>
      <div className={styles.ButtonWrapper}>
        <Button text="Next" onSubmit={onClick} />
      </div> */}
      <div className={styles.googleLogin}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse.credential);
            handleGoogleLogin(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
      <div className={styles.TextWrapper}>
        By entering your number, you’re agreeing to our Terms of Service and
        Privacy Policy. Thanks!
      </div>
    </Card>
  );
};

export default Email;
