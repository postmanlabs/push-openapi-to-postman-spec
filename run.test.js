const core = require('@actions/core');

const { readSchemaFile } = require('./readFile');
const updateSpec = require('./updateSpec');
const run = require('./run');


jest.mock('./readFile');
jest.mock('./updateSpec');
jest.mock('@actions/core');

const SPEC_ID = 'SPEC_ID';
const INPUT_VARIABLES = {
  'postman-api-key': 'API_KEY',
  'path-to-definition': './openAPI.json',
  'spec-id': 'SPEC_ID',
  'api-path-to-file-name': 'index.json',
};

describe('test run', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(core, 'getInput').mockImplementation((argument) => {
      return INPUT_VARIABLES[argument];
    });
  });

  test('when everything works properly', async () => {
    readSchemaFile.mockReturnValue('text');

    await run();

    expect(readSchemaFile).toHaveBeenCalledWith('./openAPI.json');
    expect(updateSpec).toHaveBeenCalledWith('API_KEY', 'SPEC_ID', 'text', 'index.json');
    expect(core.setOutput).toHaveBeenCalledWith('specId', SPEC_ID);
  });

  test('when readFile fails', async () => {
    readSchemaFile.mockImplementation(() => {
      throw new Error('Error reading file');
    });

    await run();

    expect(readSchemaFile).toHaveBeenCalledWith('./openAPI.json');
    expect(updateSpec).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalledWith('Error reading file');
  });

  test('when updateSpec fails', async () => {
    readSchemaFile.mockReturnValue('text');
    updateSpec.mockImplementation(() => {
      const error = new Error('Error updating schema');
      error.response = {
        status: 400,
        data: 'Error',
      }
      throw error;
    });

    await run();

    expect(readSchemaFile).toHaveBeenCalledWith('./openAPI.json');
    expect(updateSpec).toHaveBeenCalledWith('API_KEY', 'SPEC_ID', 'text', 'index.json');
    expect(core.setFailed).toHaveBeenCalledWith('Error updating schema. Error code: 400. Error body: "Error"');
  });
});

