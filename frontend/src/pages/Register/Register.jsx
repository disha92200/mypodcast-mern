import React ,{useState}from 'react'
import StepEmailorPhone from '../Steps/StepEmailorPhone/StepEmailorPhone';
import StepOtp from '../Steps/StepOtp/StepOtp';
import StepFullName from '../Steps/StepFullName/StepFullName';
import StepAvatar from '../Steps/StepAvatar/StepAvatar';
import StepUserName from '../Steps/StepUserName/StepUserName';

const steps={
    1:StepEmailorPhone,
    2:StepOtp,
    3:StepFullName,
    4:StepAvatar,
    5:StepUserName
}
const Register = () => {
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

export default Register
