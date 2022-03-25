export function insertStr(soure: string, start: number, newStr: string) {
  return soure.slice(0, start) + newStr + soure.slice(start);
}