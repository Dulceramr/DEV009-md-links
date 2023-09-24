  const path = require('path');
  const fs = require('fs').promises;
  const { getFilesInDirectory, getMarkdownFiles, processFile } = require('./data');

  const mdLinks = (inputPath, validate = false) => {
    let resolvedPath = inputPath;
    if (!path.isAbsolute(inputPath)) { //if path is relative 
      resolvedPath = path.resolve(inputPath); //takes inputPath and makes it absolute
    }
    return new Promise((resolve, reject) => {
      fs.stat(resolvedPath) // get information about the file
        .then(stats => {
          if(stats.isDirectory()){ //verify is resolvedPath is a folder
            return getFilesInDirectory(resolvedPath) //get the list of all the files in the folder
               .then(files => {
                const markdownFiles = getMarkdownFiles(files); //filter markdown files
                const promises = markdownFiles.map(file => {
                  return processFile(file, validate)
                });
                return Promise.all(promises) //wait for all the promises to complete  
                  .then(results => {
                    return results.flat();
                  });
               });
          } else {
            return processFile(resolvedPath, validate);
          }
        })
        .then(links => {
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
