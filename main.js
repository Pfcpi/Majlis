const {BrowserWindow, app} = require('electron');
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {
            preload : path.join(__dirname, 'preload.js')
        }
        
    })
    
    win.loadFile("index.html")
}



app.whenReady().then(() => {
    createWindow();
});
