const readFile = (file: File, func?: ()=>void) => {
  return new Promise<string | "">((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
      if(func)
        func();
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default readFile;