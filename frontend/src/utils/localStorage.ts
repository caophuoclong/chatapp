const LocalStorage = {
    getAccessToken: ()=>{
        return window.localStorage.getItem("access_token");
    },
    setAccessToken: (token: string)=>{
        window.localStorage.setItem("access_token", token);
    }
}
export default LocalStorage;