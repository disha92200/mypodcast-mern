import axios from 'axios'

const url=process.env.REACT_APP_API_URL

const api=axios.create({
    withCredentials:true,
    baseURL:url,
    headers:{
        'Content-type':'application/json',
        Accept:'application/json'
    }
});

export const sendOtp=async (data)=>{
    return await api.post('/api/send-otp',data)
}
export const verifyOtp=async (data)=>{
    return await api.post('/api/verify-otp',data)
}

export default api;