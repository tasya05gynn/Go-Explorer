const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

let mainWindow;

const createWindow = () => {
  // create the window
  mainWindow = new BrowserWindow({

    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools:false,
    },
  });

  // and index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // remove menu
  mainWindow.setMenu(null);

  
  mainWindow.webContents.openDevTools();
};


app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('quit-app', () => {
  app.quit();
});


