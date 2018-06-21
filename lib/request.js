const fetch = require('node-fetch')

const request = route => handle => error => {
    let fetchArgs = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    fetch(route)
        .then(response => {
            console.log('infetch',response)
            if (response.ok) {
                console.log('infetch ok',response)
                return response.json();
            } else {
                console.log('infetch err',response)
                throw new Error('Something went wrong ...');

            }
            console.log('infetch',handle)
        }).then(handle)
        .catch(error)
};

module.exports = request