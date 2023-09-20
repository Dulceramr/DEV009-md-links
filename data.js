const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');

const getFilesInDirectory = (directoryPath) => {
    return fs.readdir(directoryPath);
  };

  const getMarkdownFiles = (files) => {
    const markdownExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
    return files.filter(file => markdownExtensions.includes(path.extname(file)));
  };

  const processFile = (filePath, validate) => {
    return fs.readFile(filePath, 'utf8')
       .then(content => {
        const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
        let match;
        const links = [];
        while (match = regex.exec(content)) {
          links.push({
            text: match[1],
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
  };

  const validateLink = (link) => {
    return axios.get(link.href) //make an HTTP GET request using Axios
        .then(response => {
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
    getMarkdownFiles,
    processFile
};