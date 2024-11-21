export const getFullTime = (time) => {
  const startTime = new Date(time);
  return `${startTime.getDate()}/${
    startTime.getMonth() + 1
  }/${startTime.getFullYear()} - ${startTime.getHours()}:${startTime.getMinutes()}`;
};
