import { SERVER_URL } from '~/configs';
export const renderAvatar = (name?: string)=>{
    // check if content is a url
    if (!name) return '';
    if (
      name.startsWith('https:') ||
      name.startsWith('http:') ||
      name.startsWith('data:image') ||
      name.startsWith('blob:')
    ) {
      return name;
    }
    return `${SERVER_URL}/images/${name}`;
}