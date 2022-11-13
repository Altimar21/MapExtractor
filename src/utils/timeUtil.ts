export const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export const getDateString = (): string => {
  const date = new Date();
  return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
};

export const getTimeString = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
};
