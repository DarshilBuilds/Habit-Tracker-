const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
  process.exit(0); 
}

// 🛡️ SAFE GUARD: Define fallback values if Forge didn't inject them yet
const DEV_SERVER_URL = typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== 'undefined' 
  ? MAIN_WINDOW_VITE_DEV_SERVER_URL 
  : null;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;  

  const mainWindow = new BrowserWindow({ 
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    },
  });

  // 📦 Use our safe fallback variable block
  if (DEV_SERVER_URL) {
    mainWindow.loadURL(DEV_SERVER_URL);
    mainWindow.webContents.openDevTools(); 
  } else {
    // Standard relative local path fallback framework
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
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
