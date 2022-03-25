export function formatTime(date_ob: Date):string {
  // adjust 0 before single digit date
  const date = ("0" + date_ob.getDate()).slice(-2);
  // current month
  const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  const year = date_ob.getFullYear();
  // current hours
  const hours = date_ob.getHours();
  // current minutes
  const minutes = date_ob.getMinutes();
  // current seconds
  const seconds = date_ob.getSeconds();
  return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
}