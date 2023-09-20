const { validateLink } = require('../data.js')
const axios = require('axios');

jest.mock('axios')

describe('validateLink', () => {
    it('deberia resolver si el link es valido', () => {
        axios.get.mockResolvedValue({status: 200});
        return expect(validateLink({ href: 'https://www.google.com.mx/' })).resolves.toHaveProperty('status', 200); 
    });

    it('deberia reject si el link NO es valido', () => {
        axios.get.mockRejectedValue({response:{status: 404}});
        return expect(validateLink({ href: 'https://www.google.com.mx/dev009' })).resolves.toHaveProperty('status', 404); 
    });
})