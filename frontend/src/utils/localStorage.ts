export default {
    getAccessToken: ()=>{
        return window.localStorage.getItem("access_token");
    },
    setAccessToken: (token: string)=>{
        window.localStorage.setItem("access_token", token);
    }
}