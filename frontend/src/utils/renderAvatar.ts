import { SERVER_URL } from '~/configs';
export const renderAvatar = (name: string)=>{
    if(name === null ||  name === undefined){
        return undefined;
    }
   return  `${SERVER_URL}/images/${name}`
}