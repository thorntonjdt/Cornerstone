function formatDate(date, getTime){
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var date = new Date(date);
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  var formattedDate = monthNames[monthIndex] + ' ' + day + ', ' + year;

  if(getTime){
    var hour = date.getHours();
    var minute = date.getMinutes();
    var period = "am"
    if(hour > 12){
      hour -= 9;
      period = "pm"
    }
    formattedDate += ", "+hour+":"+minute+period;
  }

  return formattedDate;
};

export default formatDate;
