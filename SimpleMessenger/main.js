const config = require('./config');

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu;
const { shell, ipcMain } = electron;

const path = require('path')
const url = require('url')

const mainURL = config.get('useWorkChat') ? 'https://work.facebook.com/chat' : 'https://www.messenger.com/login/';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000, 
    height: 800, 
    icon:"images/msgIco.ico",
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
app.on('ready', createWindow)
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
          label:"Exit",
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
              icon:"images/msgIco.ico",
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
