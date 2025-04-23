const core = require('@actions/core');
const axios = require('axios');
const {getAxiosConfig} = require('./axiosUtils');
const {POSTMAN_API_BASE_URL} = require('./constants');

const updateSpec = async (postmanApiKey, specId, fileContents, fileName) => {
    const url = `${POSTMAN_API_BASE_URL}/specs/${specId}/files/${fileName}`;
    core.info(`Updating file content on Postman: ${url} ...`);
    const response = await axios.patch(url,
        {content: fileContents},
        getAxiosConfig(postmanApiKey),
    );
    core.debug(`Postman API PATCH updateSpecFile response code: ${response.status}`);
    return response;
}

module.exports = updateSpec;
