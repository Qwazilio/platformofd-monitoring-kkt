import axios from 'axios';

const baseInstance = () => (axios.create({
    baseURL: 'https://ofv-api-v0-1-1.evotor.ru/',  
}));

const axiosIPK = baseInstance();
const axiosIPG = baseInstance();
const axiosNeo = baseInstance();
const axiosMM = baseInstance();
const axiosMMR = baseInstance();
const axiosDB = baseInstance();

axiosIPK.interceptors.request.use((config) => {
    config.headers['token'] = process.env.IPK_TOKEN
    config.headers['Accept'] = 'application/json'
    config.headers['Accept-Charset'] = 'utf-8'
    return config; 
}, (error) => {
    return Promise.reject(error);
});

axiosIPG.interceptors.request.use((config) => {
    config.headers['token'] = process.env.IPG_TOKEN
    config.headers['Accept'] = 'application/json'
    config.headers['Accept-Charset'] = 'utf-8'
    return config; 
}, (error) => {
    return Promise.reject(error);
});


axiosNeo.interceptors.request.use((config) => {
    config.headers['token'] = process.env.NEO_TOKEN
    config.headers['Accept'] = 'application/json'
    config.headers['Accept-Charset'] = 'utf-8'
    return config; 
}, (error) => {
    return Promise.reject(error);
});


axiosMM.interceptors.request.use((config) => {
    config.headers['token'] = process.env.MM_TOKEN
    config.headers['Accept'] = 'application/json'
    config.headers['Accept-Charset'] = 'utf-8'
    return config; 
}, (error) => {
    return Promise.reject(error);
});


axiosMMR.interceptors.request.use((config) => {
    config.headers['token'] = process.env.MMR_TOKEN
    config.headers['Accept'] = 'application/json'
    config.headers['Accept-Charset'] = 'utf-8'
    return config; 
}, (error) => {
    return Promise.reject(error);
});


axiosDB.interceptors.request.use((config) => {
    config.headers['token'] = process.env.DB_TOKEN
    config.headers['Accept'] = 'application/json'
    config.headers['Accept-Charset'] = 'utf-8'
    return config; 
}, (error) => {
    return Promise.reject(error);
});


export {axiosIPK, axiosDB, axiosMM, axiosMMR, axiosNeo, axiosIPG}