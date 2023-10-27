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

export function get_thre_digit_month(date) {
  return format(new Date(date), 'yyyy-MMM-dd');
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



export const convert_string_to_month = (moth_str) => {
  var day_expiry = moth_str.slice(0, 2);
  var moth_str = moth_str.slice(2, 4);
  var year_expiry = moth_str.slice(-2);

  console.log("year_expiry", year_expiry)
  console.log("moth_str", moth_str)
  console.log("day_expiry", day_expiry)

  let month_string
  if (moth_str === "01") {
    month_string = "JAN";
  } else if (moth_str === "02") {
    month_string = "FEB";
  }
  else if (moth_str === "03") {
    month_string = "MAR";
  }
  else if (moth_str === "04") {
    month_string = "APR";
  }
  else if (moth_str === "05") {
    month_string = "MAY";
  }
  else if (moth_str === "06") {
    month_string = "JUN";
  }
  else if (moth_str === "07") {
    month_string = "JUL";
  }
  else if (moth_str === "08") {
    month_string = "AUG";
  }
  else if (moth_str === "09") {
    month_string = "SEP";
  }
  else if (moth_str === "10") {
    month_string = "OCT";
  }
  else if (moth_str === "11") {
    month_string = "NOV";
  }
  else if (moth_str === "12") {
    month_string = "DEC";
  }

  return `${year_expiry}${month_string}${day_expiry}`

}
export const dateFormate = (date) => {
  const dt = dateTime.create(date);
  const ccdate = dt.format('Y-m-d');
  return ccdate
}
