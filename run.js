const core = require('@actions/core');
const { readSchemaFile } = require('./readFile');
const updateSpec = require('./updateSpec');


async function run() {
  try {
    const postmanApiKey = core.getInput('postman-api-key');
    const path = core.getInput('path-to-definition');
    const specId = core.getInput('spec-id');
    const fileName = 'index.yaml';

    core.info(`Inputs:`);
    core.info(`  path-to-definition: ${path}`);
    core.info(`  spec-id: ${specId}`);
    core.info(`  api-path-to-file-name: ${fileName}`);

    core.info(`Reading OpenAPI definition file ...`);
    const openAPIFileContents = await readSchemaFile(path);

    core.info(`Updating spec ...`);
    await updateSpec(postmanApiKey, specId, openAPIFileContents, fileName);

    core.setOutput('specId', specId);
  } catch (error) {
    let message = error.message;
    if (error.response) {
      message = `${message}. Error code: ${error.response.status}. Error body: ${JSON.stringify(error.response.data)}`;
    }
    core.setFailed(message);
  }
}

module.exports = run;
