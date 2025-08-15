import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;
//const BASE_URL = 'http://localhost:3001'; // Fallback for local development

const axiosDefault= axios.create({
    baseURL: BASE_URL,
});

axiosDefault.interceptors.request.use((config) => {

    return config; 
}, (error) => {
    return Promise.reject(error);
});

export default axiosDefault;
