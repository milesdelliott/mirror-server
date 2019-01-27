const fetch = require('node-fetch');

const request = route => handle => error => {
  let fetchArgs = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  fetch(route)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(route, response);
        throw new Error('Something went wrong ...');
      }
    })
    .then(handle)
    .catch(error);
};

module.exports = request;
