const { app, BrowserWindow } = require('electron');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');

let ngrokUrl;

// Run Ngrok to expose Flask server
const ngrokProcess = exec('./ngrok http 5000'); // Replace 5000 with your Flask server port

// Capture Ngrok output
ngrokProcess.stdout.on('data', (data) => {
  const match = data.match(/(http|https):\/\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+/);
  if (match) {
    ngrokUrl = match[0];
    console.log(`Ngrok URL: ${ngrokUrl}`);

    // Create the Electron window after getting Ngrok URL
    createWindow();
  }
});

// Handle Ngrok process exit
ngrokProcess.on('exit', (code, signal) => {
  console.log(`Ngrok process exited with code ${code} and signal ${signal}`);
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // You can now use ngrokUrl as the base URL in your Electron app
  console.log('Electron is ready!');
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
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

// Handle Electron app exit
app.on('before-quit', () => {
  // Terminate Ngrok when the Electron app is closed
  ngrokProcess.kill();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(`Uncaught Exception: ${error}`);
  ngrokProcess.kill();
  app.quit();
});
