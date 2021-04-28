const { ipcMain } = require('electron')

const { app, BrowserWindow, net } = require('electron');
const path = require('path');


app.commandLine.appendSwitch('--ignore-certificate-errors');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {

  const mainWindow = new BrowserWindow({
    backgroundColor: '#182022',
    width: 700,
    height: 450,
    icon: __dirname + '/icon/favicon.ico',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  mainWindow.setMenuBarVisibility(false)

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
