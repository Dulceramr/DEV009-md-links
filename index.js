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
      if (markdownExtensions.includes(fileExtension)){
        resolve("The file is Markdown");
      } else {
        reject(new Error("Invalid file extension"))
      }

    })
    .catch(err => {
      reject(new Error("Path not found"))
    });

  })
}

module.exports = mdLinks;
