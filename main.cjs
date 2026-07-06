const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
  process.exit(0);
}

const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
const INDEX_PATH = path.join(__dirname, 'dist', 'index.html');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  if (!app.isPackaged) {
    mainWindow.loadURL(DEV_SERVER_URL).catch(() => {
      mainWindow.loadFile(INDEX_PATH);
    });
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(INDEX_PATH);
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
