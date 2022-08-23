import axios from "axios"
import queryString from "query-string";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const axiosClient = axios.create({
    baseURL: SERVER_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});
axiosClient.interceptors.request.use(config =>{
    if(config){
        if(config.headers)
            config.headers.Authorization = "Bearer " + localStorage.getItem("access_token");
    }
    return config;
})
export default axiosClient; 
