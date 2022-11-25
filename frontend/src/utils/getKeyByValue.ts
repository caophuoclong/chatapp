
function getKeyByValue<T extends {
  [key: string] : any
}>(object1: T, value: string): keyof T | undefined{
  // console.log(Object.keys(object))
  const arrayKeys = Object.keys(object1 as {}) as (keyof T)[];
  const response = arrayKeys.find((key) => (object1[key] as string) === value.replaceAll("'", ""));
    return response
  }
export default getKeyByValue;