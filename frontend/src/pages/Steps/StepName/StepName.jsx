import React from "react";
import { useState } from "react";
import Button from "../../../components/Button/Button";
import Card from "../../../components/Card/Card";
import styles from "./StepName.module.css";
import { useDispatch,useSelector } from "react-redux";
import { setName } from "../../../store/activateSlice";

const StepName = ({ onClick }) => {

  const name=useSelector((state)=>state.activate.name)

  const [fullName, setFullName] = useState(name);

  const dispatch = useDispatch();

  const handleSubmit = () => {

    if (!fullName) {
      return;
    }
    dispatch(setName({ name: fullName }));
    onClick();
  };

  return (
    <div className={styles.CardWrapper}>
      <Card title="What’s your full name?" logo="./images/smilie.png">
        <div className={styles.InputWrapper}>
          <input
            className={styles.Input}
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
        </div>
        <div className={styles.TextWrapper}>
          <p>People use real names at My Podcast !</p>{" "}
        </div>
        <div className={styles.ButtonWrapper}>
          <Button text="Next" onSubmit={handleSubmit} />
        </div>
      </Card>
    </div>
  );
};

export default StepName;
