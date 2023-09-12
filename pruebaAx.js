const axios = require('axios');

axios.get('https://nodejs.org/es/')
    .then(response => {
        console.log('Successful Axios request:', response.status);
    })
    .catch(error => {
        console.error('Failed Axios request:', error.message);
    });