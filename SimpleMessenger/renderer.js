// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { remote } = require('electron');
const { Menu, BrowserWindow, MenuItem, shell } = remote;

var OpenExternal = {
    privatePage: function(){
        shell.openExternal('https://sbonchev.eu/');
    },
    electronPage: function(){
        shell.openExternal('https://electronjs.org/');
    }
}