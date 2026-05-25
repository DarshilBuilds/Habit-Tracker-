const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {

  const {width, height} = screen.getPrimaryDisplay().workAreaSize;  

  const mainWindow = new BrowserWindow({ 
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Set to true and use preload script for better security
    },
  });

  // Load Vite local server in development, or compiled index.html in production
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, 'dist/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
