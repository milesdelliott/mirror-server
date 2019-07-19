const fetch = require('node-fetch');

const request = (route, message) => handle => error => {
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
        console.error('ERROR', route, response);
        return response.json();
      }
    })
    .then(handle)
    .catch(error);
};

module.exports = request;
