import electron from 'electron';
import isDev from 'electron-is-dev';
import http from 'http';
import path from 'path';
import url from 'url';

const isWindows = process.platform === 'win32';

if (isDev) {
  require('electron-debug')({ enabled: true, showDevTools: true });
}

let mainWindow;
const restoreMainWindow = async () => {
  // Create the application's main menu.
  electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate([
    {
      label: 'Application',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            electron.app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      ],
    },
  ]));

  mainWindow = new electron.BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  const handleRedirect = (event, url) => {
    if (url !== mainWindow.webContents.getURL()) {
      event.preventDefault();
      electron.shell.openExternal(url);
    }
  };

  mainWindow.webContents.on('will-navigate', handleRedirect);
  mainWindow.webContents.on('new-window', handleRedirect);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (isDev) {
    // Do not load next in the production build.
    const next = require('next')({ dev: true, dir: './renderer/src' });
    const requestHandler = next.getRequestHandler();

    // Build the renderer code and watch the files.
    await next.prepare();

    // Start the http server (with hot code reloading).
    await new Promise((resolve) => {
      const server = http.createServer(requestHandler);

      server.listen(3000, () => {
        // Make sure to stop the server when the app closes.
        electron.app.on('before-quit', () => server.close())

        resolve();
      });
    });
  }

  mainWindow.loadURL(isDev ? 'http://localhost:3000/' : url.format({
    pathname: 'index.html',
    protocol: 'file:',
    slashes: true,
  }));
};

electron.app.on('window-all-closed', () => {
  electron.app.quit();
});

electron.app.on('activate', () => {
  if (!mainWindow) {
    restoreMainWindow();
  }
});

electron.app.on('ready', () => {
  if (!isDev) {
    electron.protocol.interceptFileProtocol('file', (request, callback) => {
      const reqUrl = request.url.substr(isWindows ? 8 : 7);
      const reqUrlFinal = isWindows
        ? reqUrl.replace(path.parse(reqUrl).root, '')
        : reqUrl;

      callback(path.normalize(path.join(__dirname, reqUrlFinal)));
    });
  }
  else {
    const { default: install, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

    install(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(error => console.error('An error occurred: ', error));

    install(REDUX_DEVTOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(error => console.error('An error occurred: ', error));
  }

  restoreMainWindow();
});
