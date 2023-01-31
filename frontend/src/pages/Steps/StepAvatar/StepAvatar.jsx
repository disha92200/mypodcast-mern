import React from 'react'
import  Button from '../../../components/Button/Button'
import Card from "../../../components/Card/Card";
import styles from './StepAvatar.module.css'
import { useSelector,useDispatch } from 'react-redux';
import { useState } from 'react';
import {setAvatar} from '../../../store/activateSlice'

const StepAvatar = ({onClick}) => {
  const {name}=useSelector((state)=>state.activate)
  const [image,setImage]=useState("/images/monkey-avatar.png")
  const dispatch=useDispatch()

  const handleImageChange=(e)=>{
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setImage( reader.result);
      console.log(reader.result)
      dispatch(setAvatar( {avatar:reader.result}))
    };
  }

  return (
    <div className={styles.CardWrapper}>
      <Card title={`Okay, ${name}!`} logo="./images/avatar.png">
      <div className={styles.TextWrapper}>How’s this photo?</div>
        <div className={styles.AvatarWrapper}>
          <img className={styles.AvatarImg} src={image} alt="avatar" />
        </div>
        <div className={styles.TextWrapper}>
          <input id="avatar" type="file" className={styles.fileInput} onChange={handleImageChange}/>
          <label htmlFor="avatar">Choose a different photo</label>
        </div>
        <div className={styles.ButtonWrapper}>
          <Button text="Next" onSubmit={onClick} />
        </div>
      </Card>
    </div>
  )
}

export default StepAvatar
