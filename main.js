// with release help of https://medium.freecodecamp.org/quick-painless-automatic-updates-in-electron-d993d5408b3a

const config = require('./config');

var { app, BrowserWindow, Tray, Menu } = require('electron')

const electron = require('electron')
// Module to control application life.
//const app = electron.app
// Module to create native browser window.
//const BrowserWindow = electron.BrowserWindow
//const Menu = electron.Menu;
const { shell, ipcMain } = electron;

const path = require('path')
const url = require('url')

const { autoUpdater } = require("electron-updater");

const mainURL = config.get('useWorkChat') ? 'https://work.facebook.com/chat' : 'https://www.messenger.com/login/';
const iconName = "images/msgIco.ico";
const trayIconPath = path.join(__dirname, 'images/msgLogo.png');

// https://github.com/sindresorhus/electron-context-menu
require('electron-context-menu')({
	prepend: (params, browserWindow) => [{
		label: 'ContextMenu',
		// Only show it when right-clicking images
		visible: params.mediaType === 'image'
	}]
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000, 
    height: 800, 
    icon: iconName,
    webPreferences: {
      preload: path.join(__dirname, 'browser.js'),
      nodeIntegration: false,
      plugins: true
  }})
  mainWindow.setTitle('Simple Message')

  // and load the index.html of the app.
  mainWindow.loadURL(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  var appIcon = new Tray(trayIconPath);
  var trayContextMenu = Menu.buildFromTemplate([
    {
      label:"Show SimpleMessage", click: function() { mainWindow.show() }
    },
    {
      label:"Quit", click: function() {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  appIcon.setContextMenu(trayContextMenu)

  mainWindow.on('close', function (event) {
    mainWindow = null
    })

    mainWindow.on('minimize', function (event) {
        event.preventDefault()
        mainWindow.hide()
    })

    mainWindow.on('show', function () {
        appIcon.setHighlightMode('always')
    })

    appIcon.on('click', function(event) {
      mainWindow.show();
    })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  //mainWindow.setMenu(null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
app.on('ready', function(){
  createWindow()
  autoUpdater.checkForUpdates();
})
app.on('ready', function() {
  const menuTemplate = [
    {
      label:"Switch app",
      submenu: [
        {
          label:"Hangouts",
          click: () => {
            mainWindow.loadURL("https://accounts.google.com/signin/v2/identifier?service=talk&passive=1209600&continue=https%3A%2F%2Fhangouts.google.com%2F&followup=https%3A%2F%2Fhangouts.google.com%2F&flowName=GlifWebSignIn&flowEntry=ServiceLogin")
          }
        },
        {
          label:"Messenger",
          click: () => {
            mainWindow.loadURL(mainURL)
          }
        },
        {
          label:"Slack",
          click: () => {
            mainWindow.loadURL("https://slack.com/signin")
          }
        },
        {
          label:"Skype",
          click: () => {
            mainWindow.loadURL("https://login.skype.com/login?client_id=578134&redirect_uri=https%3A%2F%2Fweb.skype.com%2F%3FopenPstnPage%3Dtrue")
          }
        },
        {
          label:"Viber Out",
          click: () => {
            mainWindow.loadURL("https://account.viber.com/en/login")
          }
        },
        {
          label:"Quit",
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label:"Help",
      submenu:[
        {
          label:"Development",
          click: function() {
            shell.openExternal('https://sbonchev.eu');
          }
        },
        {
          label:"About",
          click: () => {
            let aboutWin = new BrowserWindow({ 
              width:300, 
              height:500, 
              title: "About", 
              icon: iconName,
              alwaysOnTop:true,
              resizable:false, 
              minimizable: false });
            aboutWin.setMenu(null);
            aboutWin.loadURL(url.format({
              pathname: path.join(__dirname, 'about.html'),
              protocol: 'file:',
              slashes: true
            }));
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('updateReady')
});

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
})