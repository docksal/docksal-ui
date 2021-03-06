const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const spawn = require('child_process').spawn;

// fixPath - inherit $PATH defined in shell
// https://github.com/electron/electron/issues/550#issuecomment-162037357
const fixPath = require('fix-path');
fixPath();

// Global dir references to use in the app
global.dir = {}; // global object to store paths to dirs
global.dir.images = path.join(__dirname, 'images');
global.dir.bash = path.join(__dirname, 'bash');
global.dir.app = path.join(__dirname, 'app');
global.dir.html = path.join(__dirname, 'app', 'html');
// global.dir.lib = path.join(__dirname, 'lib');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Logging object
global.log = require('./app/log');
global.log.start(); // comment out line to stop logging
//global.log.setErrorLevel(global.log.INFO_LEVEL);

function appOnReady() {
  //createWindow();
  require('./app/tray-menu').create();
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 1200, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', appOnReady);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (win === null) {
  //   createWindow()
  // }
});

app.on('login', function(event, webContents, request, authInfo, callback) {
  event.preventDefault();
  callback('docksal', 'docksal');
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
