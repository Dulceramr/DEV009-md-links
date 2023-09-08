const path = require('path');
const fs = require('fs').promises;

const mdLinks = (inputPath, options) => {
  let resolvedPath = inputPath;
  if (!path.isAbsolute(inputPath)) { //if path is relative 
    resolvedPath = path.resolve(inputPath); //takes inputPath and makes it absolute

  }
  return new Promise((resolve, reject) => {
    //check if path exists
    fs.access(resolvedPath)
      .then(() => {
        const fileExtension = path.extname(resolvedPath); //get file extension 
        const markdownExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
        if (markdownExtensions.includes(fileExtension)) {
          console.log("se leyo el archivo");
          return fs.readFile(resolvedPath, 'utf8');
        } else {
          console.log("estamos en el else, no se leyo el arhcivo");
          reject(new Error("Invalid file extension"));
        }
      })
      .then(content => {
        console.log("se llego a la segunda promesa");
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
        console.log("se extrajeron los links")
        console.log(links);
        resolve(links); //resolve the promise with the array of links  
      })
      .catch(err => {
        console.log("entramos en el catch");
        reject(new Error("Path not found"));
      });
  });
}
mdLinks('README.md');
module.exports = mdLinks;
