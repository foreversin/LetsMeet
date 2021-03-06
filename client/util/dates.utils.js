import moment from 'moment';

 /* input - date as dateRanges object
  {from: date, to: date }
ensure that all adjacent date ranges are merged into one. (eg. 17-21 and 22-25 => 17-25)*/
export const dateRangeReducer = (dates) => {
  for (let i = 0; i < dates.length; i += 1) {
    for (let x = i + 1; x < dates.length; x++) {
      // `dates[i]` represents every date object starting from index 0.
      //
      // `dates[x]` is every date object after dates[i]. Some dates[x] objects may get deleted
      //            as their values are merged with the current dates[i] object. In such a
      //            scenario, the dates[x] object in question will not be iterated over later
      //            as dates[i].

      const iToMoment = moment(dates[i].toDate);
      const iFromMoment = moment(dates[i].fromDate);
      const xToMoment = moment(dates[x].toDate);
      const xFromMoment = moment(dates[x].fromDate);

      // If the current dates[x] object completely overlaps the current dates[x] object, then
      // set dates[i] to dates[x] and delete the current dates[x] object from the array.
      if (xToMoment.isAfter(iToMoment) && xFromMoment.isBefore(iFromMoment)) {
        dates[i].toDate = dates[x].toDate;
        dates[i].fromDate = dates[x].fromDate;
        dates.splice(x, 1);
        x = i; continue;
      }

      if (iFromMoment.isBefore(xFromMoment) && iToMoment.isAfter(xToMoment)) {
        dates.splice(x, 1);
        x = i; continue;
      }

      // If the current dates[x] object is adjacent the current dates[i] object and
      // dates[x] > dates[i].
      if (iToMoment.add(1, 'd').isSame(xFromMoment, 'd')) {
        dates[i].toDate = dates[x].toDate;
        dates.splice(x, 1);
        x = i; continue;
      }

      // If the current dates[x] object is adjacent the current dates[i] object and
      // dates[x] < dates[i].
      if (iFromMoment.subtract(1, 'd').isSame(xToMoment, 'd')) {
        dates[i].fromDate = dates[x].fromDate;
        dates.splice(x, 1);
        x = i; continue;
      }
    }
  }
  return dates;
};


// Get all days between start and end.
  // eg. getDaysBetween(25th June 2016, 30th June 2016) => [25th, 26th, 27th, 28th, 29th, 30th]
  // (all input and output is in javascript Date objects)
export const getDaysBetween = (start, end) => {
  const dates = [start];
  let currentDay = start;

  // If the end variable's hour is 12am, then we don't want it in the allDates array, or it will
  // create an extra row in the grid made up only of disabled cells.
  if (moment(end).hour() === 0) end = moment(end).subtract(1, 'd')._d;

  while (moment(end).isAfter(dates[dates.length - 1], 'day')) {
    currentDay = moment(currentDay).add(1, 'd')._d;
    dates.push(currentDay);
  }

  return dates;
};
