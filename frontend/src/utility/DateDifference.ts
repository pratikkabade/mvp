const DateDifference = (thisDate: string) => {
    const date1 = new Date(thisDate);
    const date2 = new Date(); // Today's date
    const time1 = date1.getTime();
    const time2 = date2.getTime();
    const differenceInTime = time1 - time2;
    const differenceInDays = -1 * Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
}

export default DateDifference;