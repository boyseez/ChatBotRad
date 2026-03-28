module.exports = {
  schemaFile: 'http://backend:8082/v3/api-docs',
  apiFile: './src/store/api/baseApi.ts',
  apiImport: 'baseApi',
  outputFile: './src/store/api/generatedApi.ts',
  exportName: 'generatedApi',
  hooks: true,
}
