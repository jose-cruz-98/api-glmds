var date = new Date();
const moment = require('moment-timezone')

exports.getNewFileName = () => {
    return date.getTime()+ Math.floor((Math.random() * 9999) + 1);
}

exports.getDateToDay = () => {
    return moment().format('YYYY-MM-DD');
}

exports.getDayAndHour = () => {
   return moment().format('YYYY-MM-DD LTS');
}

exports.getDateOfYesterday = (dateToday) => {
    let today = new Date(dateToday);
    let month = today.getMonth()+1;
    return today.getFullYear() + "-" + (month > 9 ? month : "0"+ month)+ "-" + today.getDate();
}

exports.convertDayAndHour = (time) => {
    return moment(time).format('YYYY-MM-DD LTS');
}

exports.getYear = () => {
    return date.getFullYear();
}