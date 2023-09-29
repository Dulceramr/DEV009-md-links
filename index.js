  const path = require('path');
  const fs = require('fs').promises;
  const { getFilesInDirectory, processFile, isValidMarkdown } = require('./data');

  const mdLinks = (inputPath, validate = false) => {
    let resolvedPath = inputPath;
    if (!path.isAbsolute(inputPath)) { //if path is relative 
      resolvedPath = path.resolve(inputPath); //takes inputPath and makes it absolute
    }
    return new Promise((resolve, reject) => {
      fs.stat(resolvedPath) // get information about the file
        .then(stats => {
          if(stats.isDirectory()){ //verify if resolvedPath is a folder
            return getFilesInDirectory(resolvedPath) //get the list of all the files in the folder
               .then(files => {
                if(files.length === 0){
                  reject(new Error("No valid Markdown files found in the directory"));
                  return;
                }
                const promises = files.map(file => processFile(file, validate));
                return Promise.all(promises) //wait for all the promises to complete  
                  .then(results => results.flat());
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
          if(links) resolve(links);
        })
        .catch(err => {
          reject(new Error("Path not found or other error" + err.message));
        });
    }); 
  };

  module.exports = {
    mdLinks
  };
