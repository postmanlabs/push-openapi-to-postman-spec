# push-openapi-to-postman

> This code is part of a blog post and is **not** actively maintained by Postman.

Pushes an OpenAPI definition in your repository to Postman and updates an existing Spec.

You will need to add the following values to your repository:

- The `SPEC_ID` environment variable that contains the ID of the Spec you want to update.
- The `POSTMAN_API_KEY` secret that contains your valid Postman API key that can update that Spec.

## Usage

The following is an example of manual trigger and its required input:

```yaml
name: Sync OpenAPI with Postman
on:
  workflow_dispatch:
    inputs:
      releaseNotes:
        description: 'The new version release notes'
        required: false
        default: ''
jobs:
  sync-with-postman-spec:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Push OpenAPI to Postman
        id: pushSpec
        uses: davidespihernandez/push-openapi-to-postman-spec@v1
        with:
          path-to-definition: ./api_definition.yaml
          postman-api-key: ${{ secrets.POSTMAN_API_KEY }}
          spec-id: ${{ vars.SPEC_ID }}
          api-path-to-file-name: index.yaml
```

**Note:**

- The `path-to-definition` value points to the file in your repo that contains your OpenAPI definition.
- Your OpenAPI definition can be in JSON or YAML format.
- The file name in your Spec must match the `api-path-to-file-name` value.

## License

MIT
