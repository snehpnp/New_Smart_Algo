import { format, formatDistanceToNow } from 'date-fns';

const dateTime = require('node-datetime');


// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm:ss');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'MM/dd/yyyy hh:mm:ss');
}
export function f_time(date) {
  return format(new Date(date), 'yyyy-MM-dd');
}
export function fa_time(date) {
  return format(new Date(date), 'yyyy/MM/dd');
}


export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export const getActualDateFormate = (date) => {
  const dateParts = date.split("-");
  const formattedDate = `${dateParts[0]}/${parseInt(
    dateParts[1],
    10
  )}/${parseInt(dateParts[2], 10)}`;
  return formattedDate;
};


export const today = () => {
  let abc = new Date();
  let month = abc.getMonth() + 1;
  let date = abc.getDate();
  let year = abc.getFullYear();
  let full = `${year}-${month}-${date}`;
  return full
}

export const dateFormate = (date) => {
  const dt = dateTime.create(date);
  const ccdate = dt.format('Y-m-d');
  return ccdate
}
