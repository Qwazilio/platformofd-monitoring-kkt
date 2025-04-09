import axios from 'axios';

const axiosDefault= axios.create({
    baseURL: 'http://localhost:61708',
});

axiosDefault.interceptors.request.use((config) => {

    return config; 
}, (error) => {
    return Promise.reject(error);
});

export default axiosDefault;