  const path = require('path');
  const fs = require('fs').promises;
  const { getFilesInDirectory, processFile, isValidMarkdown } = require('./data');

  const mdLinks = (inputPath, validate = false) => {
    let resolvedPath = inputPath;
    if (!path.isAbsolute(inputPath)) { //function of the path module in Node.js, determines if a path is absolute or relative
      resolvedPath = path.resolve(inputPath); //is a function of the path module in Node.js, process path from right to left and construct an absolute path
    }
    return new Promise((resolve, reject) => {
      fs.stat(resolvedPath) // function of the fs module of Node.js, get information about the file or directory in the file system, return an object Stats with methods and properties
        .then(stats => {
          if(stats.isDirectory()){ //verify if resolvedPath is a folder
            return getFilesInDirectory(resolvedPath) //get the list of all the files in the folder
               .then(files => {
                if(files.length === 0){
                  reject(new Error("No valid Markdown files found in the directory"));
                  return;
                }
                const promises = files.map(file => processFile(file, validate));
                return Promise.all(promises) //function that takes an iterable of promises and returns a new promise, the new promise is resolved when all promises have been resolved, returns an array with the resolution values of all promises, wait for all the promises to complete before proceeding to the next step
                  .then(results => results.flat()); //method used to "flatten" an array of arrays to a single level, to convert it into a single array that contain all the elements of the sub-arrays
               });
          } else {
            if(!isValidMarkdown(resolvedPath)){
              reject(new Error("Invalid file extension"));
              return;
            }
            return processFile(resolvedPath, validate);
          }
        })
        .then(links => {
          //console.log(links);
          resolve(links);
        })
        .catch(err => {
          reject(new Error("Path not found or other error" + err.message));
        });
    }); 
  };

  module.exports = {
    mdLinks
  };
