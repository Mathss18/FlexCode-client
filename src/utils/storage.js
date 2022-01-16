export const setToLS = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const getFromLS = (key) => {
  const value = window.localStorage.getItem(key);

  if (value) {
    return JSON.parse(value);
  }
}

export const setToLS_async =  (key, value) => {
  return Promise.resolve().then(function () {
      localStorage.setItem(key, value);
  });
}