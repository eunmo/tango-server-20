const get = (url, callback) => {
  fetch(url)
    .then((response) => response.json())
    .then(callback);
};

export default get;
