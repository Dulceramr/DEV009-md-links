  const path = require('path');
  const fs = require('fs').promises;
  const axios = require('axios');

  const mdLinks = (inputPath, validate = false) => {
    let resolvedPath = inputPath;
    if (!path.isAbsolute(inputPath)) { //if path is relative 
      resolvedPath = path.resolve(inputPath); //takes inputPath and makes it absolute

    }
    return new Promise((resolve, reject) => {
      fs.access(resolvedPath) //check if path exists
        .then(() => {
          const fileExtension = path.extname(resolvedPath); //get file extension 
          const markdownExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
          if (markdownExtensions.includes(fileExtension)) {
            return fs.readFile(resolvedPath, 'utf8');
          } else {
            reject(new Error("Invalid file extension"));
          }
        })
        .then(content => { 
          const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
          let match;
          const links = [];
          while (match = regex.exec(content)) {
            links.push({
              text: match[1],
              href: match[2],
              file: resolvedPath
            });
          }
          if (validate) {
            const promises = links.map(link => {
              return axios.get(link.href)
                .then(response => {
                  link.status = response.status;
                  link.ok = 'ok';
                  return link;
                })
                .catch(error => {
                  link.status = error.response ? error.response.status : "no response";
                  link.ok = "Fail";
                  return link;
                })
              })
            return Promise.all(promises);
          } else {
            return links;
          } 
  })
        .then(links => {
          console.log(links);
          resolve(links);
        })
        .catch(err => {
          reject(new Error("Path not found or other error"));
        });
    }); 
  }
  mdLinks("README.md", true);
  module.exports = mdLinks;
