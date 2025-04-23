const axios = require('axios');
const {getAxiosConfig} = require('./axiosUtils');
const updateSpec = require('./updateSpec');
const {POSTMAN_API_BASE_URL} = require('./constants');


jest.mock('axios');
jest.mock('./axiosUtils', () => {
    return {
        getAxiosConfig: jest.fn().mockReturnValue({}),
    };
});
const axiosPatch = axios.patch;

describe('test updateSchemaFile', () => {
    test('calls the Postman API with the proper payload', async () => {
        axiosPatch.mockResolvedValue({status: 200});
        await updateSpec('API_KEY', 'API_ID', 'contents', 'index.json');
        expect(axiosPatch).toHaveBeenCalledTimes(1);
        expect(getAxiosConfig).toHaveBeenCalledTimes(1);
        expect(getAxiosConfig).toHaveBeenCalledWith('API_KEY');
        expect(axiosPatch).toHaveBeenCalledWith(
            `${POSTMAN_API_BASE_URL}/specs/API_ID/files/index.json`,
            {'content': 'contents'},
            {},
        );
    });
});

