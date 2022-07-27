export const nextWeek = () => {
    const currentdate = new Date();
    const oneJan = new Date(currentdate.getFullYear(),0,1);
    const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    const result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
    
    return result;
}

export const getWeek = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) /  (24 * 60 * 60 * 1000));
         
    var weekNumber = Math.ceil(days / 7);

    return weekNumber;
}