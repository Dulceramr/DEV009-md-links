const { mdLinks } = require('../index.js');

describe('mdLinks', () => {
  /*it('should return a promise', () => {
    expect(mdLinks("/Users/dulceramirez/Documents/Laboratoria/DEV009-md-links/test/threeLinksExample.mdown")).toBe(typeof Promise);
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
  it('should resolve with an empty array for an example with text and no links', () => {
    const noLinksFile = './test/noLinksExample.mkd';
    return expect(mdLinks(noLinksFile)).resolves.toEqual([]);
  });
  it('should resolve with an array with three links for a markdown file with links and text', () => {
    const threeLinksFile = './test/threeLinksExample.mdown';
    return mdLinks(threeLinksFile).then((result) => { //call mdlinks with threeLinksFile
      expect(result.length).toBeGreaterThan(0); //check if the array contains at least one element
      expect(result[0]).toHaveProperty('href'); //check that the first object has a property called href
      expect(result[0]).toHaveProperty('text');
      expect(result[0]).toHaveProperty('file');
    })
  });
  it('should reject with error for an example with empty folder', () => {
    const emptyFolder = 'test/emptyDirectory';
    return expect(mdLinks(emptyFolder)).rejects.toThrow("No valid Markdown files found in the directory");
  })
 it('should resolve with an array for an example with a folder with a markdown file inside', () => {
    const folder = 'test/newExampleDirectory';
    const result = [
      {
        text: 'Tuplas en Python',
        href: 'https://www.ionos.mx/digitalguide/paginas-web/desarrollo-web/python-tuples/',
        file: '/Users/dulceramirez/Documents/Laboratoria/DEV009-md-links/test/newExampleDirectory/markdownExample.md'
      },
      {
        text: 'Listas en Python',
        href: 'https://blog.hubspot.es/website/lista-python',
        file: '/Users/dulceramirez/Documents/Laboratoria/DEV009-md-links/test/newExampleDirectory/markdownExample.md'
      }
    ]; 
    return mdLinks(folder).then((res) => { //call mdlink function with the path of the directory, handle the result with .then
        expect(res).toEqual(result);
    })
  })
}); 
