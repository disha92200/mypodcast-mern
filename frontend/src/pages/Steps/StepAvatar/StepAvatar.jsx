import React from 'react'
import  Button from '../../../components/Button/Button'
import Card from "../../../components/Card/Card";
import styles from './StepAvatar.module.css'
import { useSelector,useDispatch } from 'react-redux';
import { useState } from 'react';
import {setAvatar} from '../../../store/activateSlice'
import { activate } from '../../../http';
import {setAuth} from '../../../store/authSlice'
import Loader from '../../../components/Loader/Loader'
import { useEffect } from 'react';


const StepAvatar = () => {
  const [unMounted,setUnMounted]=useState(false);
  const [loading,setLoading]=useState(false);
  const {name,avatar}=useSelector((state)=>state.activate)
  const [image,setImage]=useState("/images/monkey-avatar.png")
  const dispatch=useDispatch()

  const handleImageChange=(e)=>{
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setImage( reader.result);
      dispatch(setAvatar( {avatar:reader.result}))
    };
  }
  const handleSubmit=async ()=>{
    if(!name||!avatar){
      alert('Please choose an image !')
      return;
    }
    setLoading(true)
    try{

      const {data}=await activate({name,avatar});
      if(data.auth){
        //if(!unMounted){
          dispatch(setAuth({user:data.user}))
        //}
      }
      
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    return (
      setUnMounted(true)
    );
  },[])
  if(loading) return <Loader message='Activation in progress ...'/>
  return (
    <div className={styles.CardWrapper}>
      <Card title={`Okay, ${name}!`} logo="./images/avatar.png">
      <div className={styles.TextWrapper}>How’s this photo?</div>
        <div className={styles.AvatarWrapper}>
          <img className={styles.AvatarImg} src={image} alt="avatar" />
        </div>
        <div className={styles.TextWrapper}>
          <input id="avatar" type="file" className={styles.fileInput} onChange={handleImageChange}/>
          <label htmlFor="avatar" className={styles.inputImgLabel}>Choose a different photo</label>
        </div>
        <div className={styles.ButtonWrapper}>
          <Button text="Next" onSubmit={handleSubmit} />
        </div>
      </Card>
    </div>
  )
}

export default StepAvatar
