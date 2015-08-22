var app = require('app'); // Module to control application life.
var ipc = require('ipc');
var BrowserWindow = require('browser-window');

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;
var welcomeWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      'min-width': 800,
      'min-height': 600,
  });
  mainWindow.loadUrl('file://' + __dirname + '/app/views/chat.html');

  // Open the devtools.
  //mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  ipc.on('show-welcome', function() {
    mainWindow.close();
    welcomeWindow = new BrowserWindow({
      width: 800,
      height: 600,
      'min-width': 800,
      'min-height': 600,
    });
    welcomeWindow.loadUrl('file://' + __dirname + '/app/views/welcome.html');

    welcomeWindow.on('closed', function() {
      welcomeWindow = null;
    });
  });

  ipc.on('welcome-done', function() {
    welcomeWindow.close();
    mainWindow = new BrowserWindow({
      width: 600,
      height: 700,
    });
    mainWindow.loadUrl('file://' + __dirname + '/app/views/chat.html');
  });
});
