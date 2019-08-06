// This file is used for mapping the tsconfig.compilerOptions.paths
// property for the vscode-jest plugin
const { resolve } = require('path');

module.exports = {
  '^@bus/env': resolve(__dirname, 'src/environments/environment.ts'),
  '^@bus/models': resolve(__dirname, 'src/app/core/models/index.ts'),
  '^@bus/services': resolve(__dirname, 'src/app/core/services/index.ts'),
  '^@bus/state': resolve(__dirname, 'src/app/core/state/index.ts')
};
