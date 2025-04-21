import axios from 'axios';

const axiosDefault= axios.create({
    baseURL: process.env.BACKEND_SERVER_URL,
});

axiosDefault.interceptors.request.use((config) => {

    return config; 
}, (error) => {
    return Promise.reject(error);
});

export default axiosDefault;
