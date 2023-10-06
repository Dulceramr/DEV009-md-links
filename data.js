const path = require('path');
const fs = require('fs').promises;
const axios = require('axios'); //library to make http requests

const getFilesInDirectory = (directoryPath) => { //fs.readdir() method, is part of fs.promises module in Node.js
    const entries = fs.readdir(directoryPath, { withFileTypes: true }).then(entries => { // withFileTypes: true  is an option, obtain an array of dirent objects instead of just file and directory names, allows to check if is a file or directory 
      const promises = entries.map(entry => { //entries: array of dirent objects, entry: argument for the callback function, individual element (Direct object)
        const entryPath = path.join(directoryPath, entry.name); //constructing the full path of the current entry (file or directory), path.join(): function of the Node.js path module, combine all the arguments into a path
        if(entry.isDirectory()){
          return getFilesInDirectory(entryPath);
        } else if(isValidMarkdown(entry.name)){
          return Promise.resolve([entryPath]); //create and immediately return a promise that resolves to an array containing the full path
        } else {
          return Promise.resolve([]);
        }
      });
      return Promise.all(promises).then(results => { //Promise.all method is a built-in function in javascript that takes an array of promises and returns a new promise, this promise is resolved when all promises in the array have been resolved
        return [].concat(...results); //merge all the individual arrays within results into a single flat array 
      });
    });
    return entries;
  };

  const isValidMarkdown = (file) => {
    const validMarkdownExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
    return validMarkdownExtensions.includes(path.extname(file).toLowerCase()); //path.extname(): function that returns the extension of a name file, comes from the path module in Node.js
  }

  const processFile = (filePath, validate) => {
    const resultado = fs.readFile(filePath, 'utf8') //fs.readFile(): method of the fs module in Node.js, used to read the contents of a file, filePath: complete path
       .then(content => {
        const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
        let match;
        const links = []; //while loop continues as longs as there are matches, for each match the result is stored in the match variable
        while (match = regex.exec(content)) { //regex.exec(): its a regex method in JavaScript that searches for a match, if it finds a match returns an array, if not, returns null
          links.push({
            text: match[1], //second item in the match array
            href: match[2],
            file: filePath
          });
        }
        if (validate) {
          const promises = links.map(link => validateLink(link));
          return Promise.all(promises); //return a single promise that resolves to an array of validated links
        } else { // If validate is false or undefined 
          return links; //return the links array (without attempting to validate each link)
        } 
       });
       return(resultado);
  };

  const validateLink = (link) => {
    return axios.get(link.href) //make an HTTP GET request using Axios, return a promise 
        .then(response => { //response.status: contains the http status code of the response
            link.status = response.status; //add two new properties to the link object: status and ok 
            link.ok = 'ok';
            return link;
        })
        .catch(error => { 
            link.status = error.response ? error.response.status : "no response"; //set the link status to the error or "no response"
            link.ok = "Fail"; //The ok property is set to "Fail".
            return link; 
          });
};

module.exports = {
    getFilesInDirectory,
    processFile, 
    isValidMarkdown,
    validateLink
};