  const path = require('path');
  const fs = require('fs').promises;
  const { getFilesInDirectory, getMarkdownFiles, processFile } = require('./data');

  const mdLinks = (inputPath, validate = false) => {
    let resolvedPath = inputPath;
    if (!path.isAbsolute(inputPath)) { //if path is relative 
      resolvedPath = path.resolve(inputPath); //takes inputPath and makes it absolute
    }
    return new Promise((resolve, reject) => {
      fs.stat(resolvedPath) 
        .then(stats => {
          if(stats.isDirectory()){
            return getFilesInDirectory(resolvedPath)
               .then(files => {
                const markdownFiles = getMarkdownFiles(files);
                const promises = markdownFiles.map(file => {
                  const filePath = path.join(resolvedPath, file);
                  return processFile(filePath, validate)
                });
                return Promise.all(promises)
                  .then(results => {
                    return results.flat();
                  });
               });
          } else {
            return processFile(resolvedPath, validate);
          }
        })
        .then(links => {
          console.log(links);
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
