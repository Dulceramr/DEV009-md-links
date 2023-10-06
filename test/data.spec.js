const { validateLink, processFile, getFilesInDirectory } = require('../data.js')
const axios = require('axios');
const fs = require('fs').promises;

jest.mock('axios');
jest.mock('fs').promises;

describe('validateLink', () => {
    it('should resolve if the link is valid', () => {
        jest.spyOn(axios, "get").mockResolvedValue({status: 200}); //spy on calls to axios get method. mockResolvedValue: when axios.get is called it should inmmediately resolve the promise with an object that has a status property with the value 200 
        return expect(validateLink({ href: 'https://www.google.com.mx/' })).resolves.toHaveProperty('status', 200); 
    });

    it('should reject if the link is not valid', () => {
        axios.get.mockRejectedValue({response:{status: 404}}); //using axios.get mock. mockRejectedValue: reject the promise
        return expect(validateLink({ href: 'https://www.google.com.mx/dev009' })).resolves.toHaveProperty('status', 404); 
    }); //expect validateLink to handle this error and return an object with a status property with the value 404
})

describe('processFile', () => {
    it('should resolve with an array of links if validate option is true', () => {
        const threeLinksExample = '/Users/dulceramirez/Documents/Laboratoria/DEV009-md-links/test/threeLinksExample.mdown';
        return processFile(threeLinksExample, true).then((res) => {
            expect(Array.isArray(res)).toBe(true);
        })
    });
});

describe('getFilesInDirectory', () => {
    it('should resolve for an example with a folder and markdown files', () => {
        const folder = 'test/directoryWithDirectory';
        return getFilesInDirectory(folder).then((res) => {
            expect(Array.isArray(res)).toBe(true);
        })
      })
      it('should resolve with an empty array if the file isnt folder or markdown files', () => {
        const emptyFile = '/Users/dulceramirez/Documents/Laboratoria/DEV009-md-links/test/emptyDirectory';
        return getFilesInDirectory(emptyFile).then((res) => {
            expect(res).toEqual([]);
        })
      })
})