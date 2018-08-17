import { ipcRenderer } from 'electron';

// We don't actually have support for environment variables for the run-time
// app on all platforms. Hence, we just dotenv to load the file contents
// of our .env files into a variable and then selectively set it in the
// globals.
const environment = require('dotenv-extended').config();

// Only set specific environment variables in the globals.
const selection = [
  'JSON_RPC_ENDPOINT',
  'TRACK',
];

process.once('loaded', () => {
  selection.forEach((key) => {
    global[key] = environment[key];
  });

  global.ipcRenderer = ipcRenderer;
});
