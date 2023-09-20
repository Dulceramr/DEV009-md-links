const { mdLinks } = require('./index.js');

mdLinks("test/emptyExample.md", true)
.then(res => console.log(res))
.catch(error => console.log(error))
