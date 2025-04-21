import axios from 'axios';

const axiosDefault= axios.create({
    baseURL: 'http://192.168.1.3:61708',  
});

axiosDefault.interceptors.request.use((config) => {

    return config; 
}, (error) => {
    return Promise.reject(error);
});

export default axiosDefault;
