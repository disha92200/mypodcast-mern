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

export const activate=async (data)=>{
    return await api.post('/api/activate',data)
}

export const logout=async ()=>{
    return await api.post('/api/logout')
}
export const createRoom=async (data)=>{
    return await api.post('/api/rooms',data)
}
export const getAllRooms=async (data)=>{
    return await api.get('/api/rooms',data)
}


//interceptors

api.interceptors.response.use((config)=>{
    return config;
},async(error)=>{
    const originalRequest=error.config;
    if(error.response.status===401&&originalRequest&&!originalRequest.isRetry){
        originalRequest.isRetry=true;

        try{
            const response=await axios.get(
                `${process.env.REACT_APP_API_URL}/api/refresh`,
                {
                    withCredentials:true,
                }
            )
            return api.request(originalRequest);
        }catch(err){
            console.log(err.message)
        }
    }
    throw error;
})



export default api;