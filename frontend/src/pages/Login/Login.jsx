import React,{useState} from 'react'
import StepEmailorPhone from '../Steps/StepEmailorPhone/StepEmailorPhone';
import StepOtp from '../Steps/StepOtp/StepOtp';

const steps={
    1:StepEmailorPhone,
    2:StepOtp
}

const Login = () => {
    const [step,setStep]=useState(1);
    const Step=steps[step];
    const NextStep=()=>{
        setStep(step+1);
    }
  return (
    <div>
        <Step onClick={NextStep}/>
    </div>
  )
}

export default Login
