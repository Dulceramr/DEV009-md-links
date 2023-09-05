const mdLinks = require('../index.js');

describe('mdLinks', () => {
  /*it('should return a promise', () => {
    expect(mdLinks()).toBe(typeof Promise);
  });*/
  it('should be a function', () => {
    expect(typeof mdLinks).toBe('function')
  });
  it('should reject the promise if the path does not exist', () => {
    const nonExistentPath = './this/path/dont/exist.md';
    //Jest´s rejects method verifies that the promise is rejected 
    return expect(mdLinks(nonExistentPath)).rejects.toThrow("Path not found");
  });
  it('should reject with an error if the file format is not valid', () => {
    const fileFormatNotValid = './test/example.txt';
    return expect(mdLinks(fileFormatNotValid)).rejects.toThrow("Invalid file extension");
  });

});
