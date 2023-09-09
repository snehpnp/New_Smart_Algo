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

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export const dateFormate = (date) =>{
  const dt = dateTime.create(date);
  const ccdate = dt.format('Y-m-d');
  return ccdate
} 
