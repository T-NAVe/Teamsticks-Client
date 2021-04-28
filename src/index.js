const LCUConnector = require('lcu-connector');
const { ipcMain } = require('electron')

const { app, BrowserWindow, net } = require('electron');
const path = require('path');


const connector = new LCUConnector('');
//const startBtn = document.getElementById('startBtn');
app.commandLine.appendSwitch('--ignore-certificate-errors');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.

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
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
