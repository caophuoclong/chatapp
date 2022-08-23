function getKeyByValue(object: any, value: any) {
  // console.log(Object.keys(object))
  console.log(object["username"])
  console.log(value);
    return Object.keys(object).find(key => object[key] === value);
  }
export default getKeyByValue;